import React from 'react';
import Image from 'next/image';

import { Page } from '@/payload-types';

export type ImageTextBlockProps = Extract<Page['content'][0], { blockType: 'imageText' }>;

export const ImageTextBlock: React.FC<ImageTextBlockProps> = ({ text, image }) => {
  return (
    <section className="middle-column">
      <div className="flex flex-row w-full space-x-6">
        {typeof image === 'object' && (
          <div className="w-1/3 shrink-0 pt-1">
            <div className="relative aspect-square">
              <Image src={image.url!} alt={image.alt!} fill className="object-cover" />
            </div>
          </div>
        )}
        <div className="">
          <p>{text}</p>
        </div>
      </div>
    </section>
  );
};
