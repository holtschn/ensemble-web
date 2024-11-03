import { Event } from '@/payload-types';

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

export const QUERY_GQL_EVENTS = (draft: boolean) => `
query Events {
  Events(limit: 1000, sort: "-eventDate", draft: ${draft}) {
    docs {
      ${GQL_EVENT_FIELDS}
    }
  }
}
`;

export const QUERY_GQL_EVENT = (slug: string, draft: boolean) => `
query Event {
    Events(where: { slug: { equals: "${slug}" }}, draft: ${draft}) {
      docs {
        ${GQL_EVENT_FIELDS}
      }
    }
  }
`;

export type PublicEvent = {
  title: string;
  eventDateString: string;
  eventTimeString: string;
  location?: string | null;
  publicDescription?: string | null;
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
  });
}

function toTimeString(event: Event): string {
  return new Date(event.eventDate).toLocaleTimeString('de-DE', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });
}

export function sanitizeEvents(events: Event[]): PublicEvent[] {
  return events.map((event) => {
    // we move the date formatting here to the server to prevent hydration errors
    const dateString = toDateString(event);
    const timeString = toTimeString(event);
    return {
      title: event.title,
      eventDateString: dateString,
      eventTimeString: timeString,
      location: event.location,
      publicDescription: event.publicDescription,
    };
  });
}

export function enrichEvents(events: Event[]): EnrichedEvent[] {
  return events.map((event) => {
    const enrichment = { eventDateString: toDateString(event), eventTimeString: toTimeString(event) };
    return { ...enrichment, ...event };
  });
}

export async function queryEvents(isDraftMode: boolean, tokenValue: string) {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
    body: JSON.stringify({
      query: QUERY_GQL_EVENTS(isDraftMode),
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
    .then((res) => {
      console.log('events', res);
      return res;
    })
    .then((res) => res?.data?.Events.docs)
    .then((events) => enrichEvents(events))
    .catch((error) => {
      console.log('could not fetch events', error);
      return [];
    });
}

export async function queryEvent(slug: string, isDraftMode: boolean, tokenValue: string) {
  console.log(QUERY_GQL_EVENT(slug, isDraftMode));
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
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
    .then((res) => {
      console.log('events', res);
      return res;
    })
    .then((res) => res?.data?.Events.docs)
    .then((events) => enrichEvents(events))
    .then((events) => (events.length > 0 ? events[0] : null))
    .catch((error) => {
      console.log(`could not fetch event with slug ${slug}`, error);
      return null;
    });
}
