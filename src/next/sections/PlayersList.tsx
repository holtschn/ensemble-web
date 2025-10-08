import React from 'react';

import { Page } from '@/payload-types';
import { toInstrumentsString } from '@/next/utils/strings';

export type PlayersListBlockProps = Extract<Page['content'][0], { blockType: 'playersList' }>;

export const PlayersListBlock: React.FC<PlayersListBlockProps> = ({ heading, players }) => {
  return (
    <section className="middle-column flex flex-col">
      <h2>{heading}</h2>
      {players && players.length > 0 && (
        <div className="flex flex-col space-y-4">
          {players
            .filter((player) => typeof player === 'object')
            .map((player, index) => (
              <div key={`player-${index}`} className={'flex flex-col w-full text-center'}>
                <p className="text-base font-bold">{player.name}</p>
                <p className="text-xs">{toInstrumentsString(player.instruments)}</p>
              </div>
            ))}
        </div>
      )}
    </section>
  );
};
