import { getPayloadHMR } from '@payloadcms/next/utilities';

import config from '@payload-config';
import { Event } from '@/payload-types';
import { SERVER_URL } from '@/next/utils/serverUrl';

const GQL_EVENT_FIELDS = `
title
slug
publishedDate
eventStart
eventEnd
internalDescription
concertTitle
concertDate
concertLocation
concertDescription
showOnHome
updatedAt
createdAt
_status
`;

const QUERY_GQL_EVENT = (slug: string, draft: boolean) => `
query Event {
    Events(where: { slug: { equals: "${slug}" }}, draft: ${draft}) {
      docs {
        ${GQL_EVENT_FIELDS}
      }
    }
  }
`;

export type PublicEvent = Pick<Event, 'concertTitle' | 'concertLocation' | 'concertDescription' | 'slug'> & {
  concertDateString: string;
  concertTimeString: string;
};

export type EnrichedEvent = Event & {
  concertDateString: string;
  concertTimeString: string;
  eventStartDateString: string;
  eventEndDateString: string;
};

export function sanitizeEvent(event: Event): PublicEvent {
  // we move the date formatting here to the server to prevent hydration errors
  const concertDateString = toLongDateString(event.concertDate);
  const concertTimeString = toTimeString(event.concertDate);
  return {
    concertTitle: event.concertTitle,
    concertDateString: concertDateString,
    concertTimeString: concertTimeString,
    concertLocation: event.concertLocation,
    concertDescription: event.concertDescription,
    slug: event.slug,
  };
}

export function enrichEvent(event: Event): EnrichedEvent {
  const enrichment = {
    concertDateString: toLongDateString(event.concertDate),
    concertTimeString: toTimeString(event.concertDate),
    eventStartDateString: toShortDateString(event.eventStart),
    eventEndDateString: toShortDateString(event.eventEnd),
  };
  return { ...enrichment, ...event };
}

export async function getSanitizedEventsShowOnHome(isDraftMode: boolean, limit: number = 1000): Promise<PublicEvent[]> {
  const payload = await getPayloadHMR({ config });
  const data = await payload.find({
    collection: 'events',
    where: {
      showOnHome: { equals: true },
    },
    sort: '-concertDate',
    limit: limit,
    draft: isDraftMode,
  });
  if (data?.docs && data.docs.length > 0) {
    return data.docs.map(sanitizeEvent);
  }
  return [];
}

export async function getAllSanitizedEvents(isDraftMode: boolean, limit: number = 1000): Promise<PublicEvent[]> {
  const payload = await getPayloadHMR({ config });
  const data = await payload.find({
    collection: 'events',
    sort: '-concertDate',
    limit: limit,
    draft: isDraftMode,
  });
  if (data?.docs && data.docs.length > 0) {
    return data.docs.map(sanitizeEvent);
  }
  return [];
}

export async function getAllEnrichedEvents(isDraftMode: boolean, limit: number = 1000): Promise<EnrichedEvent[]> {
  const payload = await getPayloadHMR({ config });
  const data = await payload.find({
    collection: 'events',
    sort: '-concertDate',
    limit: limit,
    draft: isDraftMode,
  });
  if (data?.docs && data.docs.length > 0) {
    return data.docs.map(enrichEvent);
  }
  return [];
}

export async function queryEvent(slug: string, isDraftMode: boolean, tokenValue: string) {
  return await fetch(`${SERVER_URL}/api/graphql`, {
    body: JSON.stringify({
      query: QUERY_GQL_EVENT(slug, isDraftMode),
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? '',
      ...{ Authorization: `JWT ${tokenValue}` },
    },
    cache: 'no-store',
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => res?.data?.Events.docs)
    .then((events) => events.map(enrichEvent))
    .then((events) => (events.length > 0 ? events[0] : null))
    .catch((error) => {
      console.log(`could not fetch event with slug ${slug}`, error);
      return null;
    });
}
