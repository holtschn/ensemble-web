import React from 'react';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { getPayloadHMR } from '@payloadcms/next/utilities';

import { generateMeta } from '@/next/utils/generateMeta';
import config from '@payload-config';
import type { Page } from '@/payload-types';
import { PublicPageClient } from './page.client';

interface PublicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const data = await getPublicPageData(slug);
  if (!data) {
    return notFound();
  }
  return <PublicPageClient initialData={data} />;
}

async function getPublicPageData(slug: string): Promise<Page | null> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const payload = await getPayloadHMR({ config });
    const data = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      draft: isDraftMode,
    });
    if (data?.docs && data.docs.length > 0) {
      return data.docs[0];
    }
  } catch (error) {
    console.log('could not get page data', error);
  }
  return null;
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadHMR({ config });
    return payload
      .find({
        collection: 'pages',
        draft: false,
        where: {
          _status: { equals: 'published' },
        },
      })
      .then((data) => data.docs.map((doc) => ({ slug: doc.slug })));
  } catch (error) {
    console.log('could not generate static params', error);
  }
  return [];
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await getPublicPageData(slug);
    if (data) {
      return generateMeta(data);
    }
  } catch (error) {
    console.log('could not generate metadata', error);
  }
  return generateMeta();
}
