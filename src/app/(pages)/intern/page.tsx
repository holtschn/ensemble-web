import React from 'react';
import { draftMode } from 'next/headers';

import { getAllSanitizedEvents, PublicEvent } from '@/next/utils/events';
import { PrivateHomePageClient } from './page.client';

/*
 * interestingly the 'force-dynamic' is needed because the rendering of all interal pages is dependent on the login state of the user.
 * Without 'force-dynamic' NEXTjs generates static pages that are empty because they only render content when the user is logged in.
 */
export const dynamic = 'force-dynamic';

export default async function PrivateHomePage() {
  const events = await getEventsList();
  return <PrivateHomePageClient events={events} />;
}

async function getEventsList(): Promise<PublicEvent[]> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    return await getAllSanitizedEvents(isDraftMode);
  } catch (error) {
    console.log('could not get events list', error);
  }
  return [];
}
