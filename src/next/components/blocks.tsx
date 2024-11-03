import React from 'react';

import { Page } from '@/payload-types';

import { ParagraphTextBlock } from './paragraphText';
import { HeadingTextBlock } from './headingText';
import { ImageTextBlock } from './imageText';
import { PlayerProfileBlock } from './playerProfile';

const blockComponents = {
  paragraphText: ParagraphTextBlock,
  imageText: ImageTextBlock,
  headingText: HeadingTextBlock,
  playerProfile: PlayerProfileBlock,
};

type BlocksProps = {
  blocks: Page['content'][0][];
};

export const Blocks: React.FC<BlocksProps> = ({ blocks }) => {
  if (blocks && Array.isArray(blocks) && blocks.length > 0) {
    return (
      <div className="flex flex-col space-y-2">
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              /* @ts-expect-error */
              return <Block key={`${index}`} {...block} />;
            }
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};
