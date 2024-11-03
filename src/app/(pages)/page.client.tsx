'use client';

import React from 'react';
import Image from 'next/image';

import { useLivePreview } from '@payloadcms/live-preview-react';

import { PublicEvent } from '@/next/utils/events';
import { EventPublicDisplay } from '@/next/components/event';

type PublicHomePageClientProps = {
  initialData: PublicEvent[];
};

export const PublicHomePageClient: React.FC<PublicHomePageClientProps> = ({ initialData }) => {
  const { data } = useLivePreview<PublicEvent[]>({
    depth: 2,
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  });

  return (
    <div>
      <section className="relative w-screen h-dvh">
        <Image
          src="/homepage_hero.webp"
          alt="R(h)einblech in Deidesheim"
          fill={true}
          style={{ objectPosition: '50% 35%', objectFit: 'cover' }}
          priority
        />
      </section>

      <section className="bg-transparent">
        <div className="absolute inset-0 flex items-end justify-center pb-20 w-full">
          <div className="relative w-3/4 h-1/6 md:w-1/2">
            <Image
              src="/logo/letters_white.webp"
              alt="R(h)einblech Piktogramme"
              fill
              style={{ objectFit: 'scale-down' }}
            />
          </div>
        </div>
      </section>

      <section className="">
        <div className="middle-column">
          <h2 className="text-2xl font-bold my-8 text-center">Termine</h2>
          <div className="space-y-24">
            {data.map((event, index) => (
              <EventPublicDisplay key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
