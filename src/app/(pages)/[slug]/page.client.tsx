'use client';

import React from 'react';

import { useLivePreview } from '@payloadcms/live-preview-react';

import { PublicPage } from '@/next/utils/pages';
import { Blocks } from '@/next/sections/Blocks';
import { SERVER_URL } from '@/next/utils/serverUrl';

type PublicPageClientProps = {
  page: PublicPage;
};

export const PublicPageClient: React.FC<PublicPageClientProps> = (initialData) => {
  const { data } = useLivePreview<PublicPage>({
    initialData: initialData.page,
    serverURL: SERVER_URL!,
  });

  return (
    <div className="flex flex-col mt-16">
      <div className="middle-column">
        <h1>{`${data.title}`}</h1>
      </div>
      <Blocks blocks={data.content} />
    </div>
  );
};
