import React from 'react';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { generateMeta } from '@/next/utils/generateMeta';
import { PublicPageClient } from './page.client';
import { getAllPublicPages, getPublicPage } from '@/next/utils/pages';

interface PublicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { isEnabled: isDraftMode } = await draftMode();
  const { slug } = await params;
  const data = await getPublicPage(slug, isDraftMode);
  if (!data) {
    return notFound();
  }
  return <PublicPageClient page={data} />;
}

export async function generateStaticParams() {
  try {
    return getAllPublicPages(false).then((pages) => pages.map((page) => ({ slug: page.slug })));
  } catch (error) {
    console.log('could not generate static params', error);
  }
  return [];
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  try {
    const { isEnabled: isDraftMode } = await draftMode();
    const { slug } = await params;
    const data = await getPublicPage(slug, isDraftMode);
    if (data) {
      return generateMeta(data);
    }
  } catch (error) {
    console.log(`could not generate metadata for ${params}`, error);
  }
  return generateMeta();
}
