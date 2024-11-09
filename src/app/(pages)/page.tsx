import React from 'react';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

import { getSanitizedEventsShowOnHome } from '@/next/utils/events';
import { generateMeta } from '@/next/utils/generateMeta';
import { getSettings } from '@/next/utils/settings';

import { PublicHomePageClient } from './page.client';

export default async function PublicHomePage() {
  const { events, homepageHero, homepageLogo } = await getPublicEventsForHome();
  return <PublicHomePageClient events={events} homepageHero={homepageHero} homepageLogo={homepageLogo} />;
}

async function getPublicEventsForHome() {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const settings = await getSettings();

    const events = await getSanitizedEventsShowOnHome(isDraftMode, settings.numberEventsHome ?? 3);
    const homepageHero =
      settings.homepageHero && typeof settings.homepageHero === 'object' ? settings.homepageHero : undefined;
    const homepageLogo =
      settings.homepageLogo && typeof settings.homepageLogo === 'object' ? settings.homepageLogo : undefined;

    return { events, homepageHero, homepageLogo };
  } catch (error) {
    console.log('could not get public events for home', error);
  }
  return { events: [] };
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta();
}
