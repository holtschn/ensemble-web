import React, { JSX } from 'react';

import { Page } from '@/payload-types';

export type HeadingTextBlockProps = Extract<Page['content'][0], { blockType: 'headingText' }>;

export const HeadingTextBlock: React.FC<HeadingTextBlockProps> = ({ htmlTag, text }) => {
  const Tag = htmlTag as Extract<keyof JSX.IntrinsicElements, 'h2' | 'h3' | 'h4'>;
  return (
    <section className="middle-column">
      <Tag>{text}</Tag>
    </section>
  );
};
