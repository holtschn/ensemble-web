'use client';

import React from 'react';
import Link from 'next/link';

import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EnrichedEvent } from '@/next/utils/events';
import { eventUrlProvider } from '@/payload/utilities/slugs';
import { SERVER_URL } from '@/next/utils/serverUrl';

type PrivateHomePageClientProps = {
  events: EnrichedEvent[];
};

export const PrivateHomePageClient: React.FC<PrivateHomePageClientProps> = ({ events }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-16">
        <div className="middle-column">
          <h1>Interner Bereich</h1>
        </div>
        <div className="middle-column">
          <div className="flex flex-col space-y-4">
            <Link href="/intern/ndb">Notendatenbank</Link>
            <Link href={`${SERVER_URL!}/admin/collections/events`}>Events verwalten</Link>
            <Link href={`${SERVER_URL!}/admin/collections/users`}>Nutzer verwalten</Link>
          </div>
        </div>
        <div className="middle-column">
          <h2>Was bisher geschah</h2>
        </div>
        <div className="middle-column flex flex-col space-y-4">
          {events.map((event, index) => {
            return (
              <div key={`event-display-${index}`} className="flex flex-row w-full justify-between space-x-10">
                <div className="text-left">
                  <p className="">
                    {event.eventStartDateString} – <br /> {event.eventEndDateString}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <Link href={eventUrlProvider(event)} className="font-bold">
                      {event.title}
                    </Link>
                    , <br /> {event.concertLocation}
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
