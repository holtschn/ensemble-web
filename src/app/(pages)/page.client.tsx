import React from 'react';
import Image from 'next/image';

import { PublicEvent } from '@/next/utils/events';
import { EventPublicDisplay } from '@/next/components/event';

import { Media } from '@/payload-types';

type PublicHomePageClientProps = {
  events: PublicEvent[];
  homepageHero?: Media;
  homepageLogo?: Media;
};

export const PublicHomePageClient: React.FC<PublicHomePageClientProps> = ({ events, homepageHero, homepageLogo }) => {
  return (
    <div>
      <section className="relative w-screen h-dvh">
        <Image
          src={homepageHero?.url ?? ''}
          alt={homepageHero?.alt ?? ''}
          fill={true}
          style={{ objectPosition: '50% 35%', objectFit: 'cover' }}
          priority
        />
      </section>

      <section className="bg-transparent">
        <div className="absolute inset-0 flex items-end justify-center pb-20 w-full">
          <div className="relative w-5/6 h-1/6 md:w-2/3 animate-moveup">
            <Image
              src={homepageLogo?.url ?? ''}
              alt={homepageLogo?.alt ?? ''}
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
            {events?.map((event, index) => <EventPublicDisplay key={index} event={event} index={index} />)}
          </div>
        </div>
      </section>
    </div>
  );
};
