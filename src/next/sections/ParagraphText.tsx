import React from 'react';

import { Page } from '@/payload-types';

export type ParagraphTextBlockProps = Extract<Page['content'][0], { blockType: 'paragraphText' }>;

export const ParagraphTextBlock: React.FC<ParagraphTextBlockProps> = ({ text }) => {
  return (
    <section className="middle-column">
      <p>{text}</p>
    </section>
  );
};
