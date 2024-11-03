import React from 'react';
import Image from 'next/image';

import { Page } from '@/payload-types';

export type PlayerProfileBlockProps = Extract<Page['content'][0], { blockType: 'playerProfile' }>;

export const PlayerProfileBlock: React.FC<PlayerProfileBlockProps> = ({ name, instruments, image }) => {
  const hasImage = image && typeof image === 'object';

  return (
    <section className="middle-column">
      <div className="flex flex-row w-full space-x-6">
        {hasImage && (
          <div className="w-1/3 flex-shrink-0 pt-1">
            <div className="relative aspect-square">
              <Image src={image.url!} alt={image.alt!} fill className="object-cover" />
            </div>
          </div>
        )}
        <div className={`flex flex-col ${!hasImage ? 'w-full text-center' : 'w-2/3'}`}>
          <p className="text-base font-bold">{name}</p>
          <p className="text-xs">{instruments}</p>
        </div>
      </div>
    </section>
  );
};
