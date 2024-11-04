'use client';

import React, { useEffect } from 'react';

import { useLivePreview } from '@payloadcms/live-preview-react';

import type { Page } from '@/payload-types';
import { Blocks } from '@/next/components/blocks';
import { useAnimation } from '@/next/animation/context';

type PublicPageClientProps = {
  initialData: Page;
};

export const PublicPageClient: React.FC<PublicPageClientProps> = ({ initialData }) => {
  const { data } = useLivePreview<Page>({
    depth: 2,
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  });

  const { setAnimateHeaderOnScroll } = useAnimation();
  useEffect(() => {
    setAnimateHeaderOnScroll(false);
  }, [setAnimateHeaderOnScroll]);

  return (
    <div className="flex flex-col mt-16">
      <div className="middle-column">
        <h1>{`${data.title}`}</h1>
      </div>
      <Blocks blocks={data.content} />
    </div>
  );
};
