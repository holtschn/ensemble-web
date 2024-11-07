'use client';

import React, { useEffect } from 'react';

import { useLivePreview } from '@payloadcms/live-preview-react';

import RichText from '@/next/richtext/component';
import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EventPublicDisplay } from '@/next/components/event';
import { EnrichedEvent } from '@/next/utils/events';
import { useAnimation } from '@/next/animation/context';
import { SERVER_URL } from '@/next/utils/serverUrl';

type PrivateEventPageClientProps = {
  event: EnrichedEvent;
};

export const PrivateEventPageClient: React.FC<PrivateEventPageClientProps> = (initialData) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const { data: event } = useLivePreview<EnrichedEvent>({
    initialData: initialData.event,
    serverURL: SERVER_URL!,
  });

  const { setAnimateHeaderOnScroll } = useAnimation();
  useEffect(() => {
    setAnimateHeaderOnScroll(false);
  }, [setAnimateHeaderOnScroll]);

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-16">
        <div className="middle-column">
          <h1>{`Event: ${event.title}`}</h1>
        </div>
        <div className="middle-column">
          <EventPublicDisplay event={event} index={1} />
        </div>
        <div className="middle-column">
          <h2>Interne Informationen</h2>
        </div>
        <div className="middle-column">
          <RichText content={event.internalDescription} />
        </div>
      </div>
    )
  );
};
