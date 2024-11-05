'use client';

import React, { useEffect } from 'react';

import { useLivePreview } from '@payloadcms/live-preview-react';

import { PublicPage } from '@/next/utils/pages';
import { Blocks } from '@/next/components/blocks';
import { useAnimation } from '@/next/animation/context';

type PublicPageClientProps = {
  page: PublicPage;
};

export const PublicPageClient: React.FC<PublicPageClientProps> = (initialData) => {
  const { data: page } = useLivePreview<PublicPage>({
    initialData: initialData.page,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  });

  const { setAnimateHeaderOnScroll } = useAnimation();
  useEffect(() => {
    setAnimateHeaderOnScroll(false);
  }, [setAnimateHeaderOnScroll]);

  return (
    <div className="flex flex-col mt-16">
      <div className="middle-column">
        <h1>{`${page.title}`}</h1>
      </div>
      <Blocks blocks={page.content} />
    </div>
  );
};
