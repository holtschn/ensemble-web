import { getPayloadHMR } from '@payloadcms/next/utilities';

import config from '@payload-config';
import { Event } from '@/payload-types';
import { SERVER_URL } from '@/next/utils/serverUrl';

const GQL_EVENT_FIELDS = `
title
slug
publishedDate
eventDate
location
showOnHome
publicDescription
internalDescription
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

export type PublicEvent = Pick<Event, 'title' | 'location' | 'publicDescription' | 'slug'> & {
  eventDateString: string;
  eventTimeString: string;
};

export type EnrichedEvent = Event & {
  eventDateString: string;
  eventTimeString: string;
};

function toDateString(event: Event): string {
  return new Date(event.eventDate).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'Europe/Berlin',
  });
}

function toTimeString(event: Event): string {
  return new Date(event.eventDate).toLocaleTimeString('de-DE', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
    timeZone: 'Europe/Berlin',
  });
}

export function sanitizeEvent(event: Event): PublicEvent {
  // we move the date formatting here to the server to prevent hydration errors
  const dateString = toDateString(event);
  const timeString = toTimeString(event);
  return {
    title: event.title,
    eventDateString: dateString,
    eventTimeString: timeString,
    location: event.location,
    publicDescription: event.publicDescription,
    slug: event.slug,
  };
}

export function enrichEvent(event: Event): EnrichedEvent {
  const enrichment = { eventDateString: toDateString(event), eventTimeString: toTimeString(event) };
  return { ...enrichment, ...event };
}

export async function getSanitizedEventsShowOnHome(isDraftMode: boolean, limit: number = 1000): Promise<PublicEvent[]> {
  const payload = await getPayloadHMR({ config });
  const data = await payload.find({
    collection: 'events',
    where: {
      showOnHome: { equals: true },
    },
    sort: '-eventDate',
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
    sort: '-eventDate',
    limit: limit,
    draft: isDraftMode,
  });
  if (data?.docs && data.docs.length > 0) {
    return data.docs.map(sanitizeEvent);
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
