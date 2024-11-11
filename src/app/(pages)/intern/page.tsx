import React from 'react';
import { draftMode } from 'next/headers';

import { EnrichedEvent, getAllEnrichedEvents } from '@/next/utils/events';
import { PrivateHomePageClient } from './page.client';

export default async function PrivateHomePage() {
  const events = await getEventsList();
  return <PrivateHomePageClient events={events} />;
}

async function getEventsList(): Promise<EnrichedEvent[]> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    return await getAllEnrichedEvents(isDraftMode);
  } catch (error) {
    console.log('could not get events list', error);
  }
  return [];
}
