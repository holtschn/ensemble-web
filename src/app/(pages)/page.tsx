import React from 'react';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';

import { getPayloadHMR } from '@payloadcms/next/utilities';

import config from '@payload-config';
import { PublicEvent, sanitizeEvents } from '@/next/utils/events';
import { generateMeta } from '@/next/utils/generateMeta';
import { PublicHomePageClient } from './page.client';
import { getSettings } from '@/next/utils/settings';

export default async function PublicHomePage() {
  const data = await getHomePageData();
  return <PublicHomePageClient initialData={data} />;
}

async function getHomePageData(): Promise<PublicEvent[]> {
  const { isEnabled: isDraftMode } = await draftMode();
  const settings = await getSettings();
  const payload = await getPayloadHMR({ config });
  try {
    const data = await payload.find({
      collection: 'events',
      where: {
        showOnHome: { equals: true },
      },
      sort: '-eventDate',
      limit: settings.numberEventsHome ?? 3,
      draft: isDraftMode,
    });
    if (data?.docs && data.docs.length > 0) {
      return sanitizeEvents(data.docs);
    }
  } catch (error) {
    console.log('could not get home page data', error);
  }
  return [];
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta();
}
