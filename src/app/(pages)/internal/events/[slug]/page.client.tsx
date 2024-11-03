'use client';

import React from 'react';

import { useLivePreview } from '@payloadcms/live-preview-react';

import RichText from '@/next/richtext/component';
import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EventPublicDisplay } from '@/next/components/event';
import { EnrichedEvent } from '@/next/utils/events';

type PrivateEventPageClientProps = {
  initialData: EnrichedEvent;
};

export const PrivateEventPageClient: React.FC<PrivateEventPageClientProps> = ({ initialData }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const { data } = useLivePreview<EnrichedEvent>({
    depth: 2,
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  });

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-16">
        <div className="middle-column">
          <h1>{`Event: ${data.title}`}</h1>
        </div>
        <div className="middle-column">
          <EventPublicDisplay event={data} index={1} />
        </div>
        <div className="middle-column">
          <h2>Interne Informationen</h2>
        </div>
        <div className="middle-column">
          <RichText content={data.internalDescription} />
        </div>
      </div>
    )
  );
};
