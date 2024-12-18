import React from 'react';
import { cookies, draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { PrivateEventPageClient } from './page.client';
import { EnrichedEvent, getAllSanitizedEvents, queryEvent } from '@/next/utils/events';
import { AnimateHeaderWrapper } from '@/next/animation/wrapper';

export const dynamic = 'force-dynamic';

interface PrivateEventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PrivateEventPage({ params }: PrivateEventPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    return notFound();
  }
  return (
    <AnimateHeaderWrapper animateHeader={false}>
      <PrivateEventPageClient event={event} />
    </AnimateHeaderWrapper>
  );
}

async function getEvent(slug: string): Promise<EnrichedEvent | null> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const token = (await cookies()).get(process.env.PAYLOAD_COOKIE_TOKEN_NAME!);
    if (token && token.value) {
      return await queryEvent(slug, isDraftMode, token.value);
    }
  } catch (error) {
    console.log(`could not get event for slug '${slug}'`, error);
  }
  return null;
}

export async function generateStaticParams() {
  try {
    return getAllSanitizedEvents(false).then((events) => events.map((event) => ({ slug: event.slug })));
  } catch (error) {
    console.log('could not generate static params', error);
  }
  return [];
}
