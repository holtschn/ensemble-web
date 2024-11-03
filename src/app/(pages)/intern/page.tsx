import React from 'react';
import { draftMode, cookies } from 'next/headers';

import { EnrichedEvent, queryEvents } from '@/next/utils/events';
import { PrivateHomePageClient } from './page.client';

export default async function PrivateHomePage() {
  const events = await getEventsList();
  return <PrivateHomePageClient initialData={events} />;
}

async function getEventsList(): Promise<EnrichedEvent[]> {
  const { isEnabled: isDraftMode } = await draftMode();
  const token = (await cookies()).get(process.env.PAYLOAD_COOKIE_TOKEN_NAME!);
  if (token && token.value) {
    return await queryEvents(isDraftMode, token.value);
  }
  return [];
}
