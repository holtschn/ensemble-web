import React from 'react';
import { cookies, draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { PrivateEventPageClient } from './page.client';
import { EnrichedEvent, queryEvent } from '@/next/utils/events';

interface PrivateEventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PrivateEventPage({ params }: PrivateEventPageProps) {
  const { slug } = await params;
  const data = await getEvent(slug);
  if (!data) {
    return notFound();
  }
  return <PrivateEventPageClient initialData={data} />;
}

async function getEvent(slug: string): Promise<EnrichedEvent | null> {
  const { isEnabled: isDraftMode } = await draftMode();
  const token = (await cookies()).get(process.env.PAYLOAD_COOKIE_TOKEN_NAME!);
  if (token && token.value) {
    return await queryEvent(slug, isDraftMode, token.value);
  }
  return null;
}
