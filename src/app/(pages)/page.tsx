import React from 'react';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

import { getSanitizedEventsShowOnHome, PublicEvent } from '@/next/utils/events';
import { generateMeta } from '@/next/utils/generateMeta';
import { PublicHomePageClient } from './page.client';
import { getSettings } from '@/next/utils/settings';

export default async function PublicHomePage() {
  const data = await getPublicEventsForHome();
  return <PublicHomePageClient events={data} />;
}

async function getPublicEventsForHome(): Promise<PublicEvent[]> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const settings = await getSettings();
    return await getSanitizedEventsShowOnHome(isDraftMode, settings.numberEventsHome ?? 3);
  } catch (error) {
    console.log('could not get public events for home', error);
  }
  return [];
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta();
}
