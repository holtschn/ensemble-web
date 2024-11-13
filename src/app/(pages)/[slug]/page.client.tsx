import React from 'react';

import { useLivePreview } from '@payloadcms/live-preview-react';

import { PublicPage } from '@/next/utils/pages';
import { Blocks } from '@/next/components/blocks';
import { SERVER_URL } from '@/next/utils/serverUrl';

type PublicPageClientProps = {
  page: PublicPage;
};

export const PublicPageClient: React.FC<PublicPageClientProps> = (initialData) => {
  const { data: page } = useLivePreview<PublicPage>({
    initialData: initialData.page,
    serverURL: SERVER_URL!,
  });

  return (
    <div className="flex flex-col mt-16">
      <div className="middle-column">
        <h1>{`${page.title}`}</h1>
      </div>
      <Blocks blocks={page.content} />
    </div>
  );
};
