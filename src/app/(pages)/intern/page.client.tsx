'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

import { useLivePreview } from '@payloadcms/live-preview-react';

import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EnrichedEvent } from '@/next/utils/events';
import { eventUrlProvider } from '@/payload/utilities/slugs';
import { useAnimation } from '@/next/animation/context';

type PrivateHomePageClientProps = {
  initialData: EnrichedEvent[];
};

export const PrivateHomePageClient: React.FC<PrivateHomePageClientProps> = ({ initialData }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const { data } = useLivePreview<EnrichedEvent[]>({
    depth: 2,
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  });

  const { setAnimateHeaderOnScroll } = useAnimation();
  useEffect(() => {
    setAnimateHeaderOnScroll(false);
  }, [setAnimateHeaderOnScroll]);

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-16">
        <div className="middle-column">
          <h1>Interner Bereich</h1>
        </div>
        <div className="middle-column">
          <div className="middle-column flex flex-col space-y-4">
            <Link href={process.env.NEXT_PUBLIC_NOTENDATENBANK_LINK!} target="_blank">
              Notendatenbank
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL!}/admin/collections/events`}>Events verwalten</Link>
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL!}/admin/collections/users`}>Nutzer verwalten</Link>
          </div>
        </div>
        <div className="middle-column">
          <h2>Was bisher geschah</h2>
        </div>
        <div className="middle-column flex flex-col space-y-4">
          {data.map((event, index) => {
            return (
              <div key={`event-display-${index}`} className="flex flex-row w-full justify-between space-x-10">
                <div className="text-left">
                  <p className="">{event.eventDateString}</p>
                </div>
                <div className="text-right">
                  <p>
                    <Link href={eventUrlProvider(event)} className="font-bold">
                      {event.title}
                    </Link>
                    , {event.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};
