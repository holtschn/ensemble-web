'use client';

import React from 'react';

import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EnrichedUser } from '@/next/utils/users';

type PrivatePlayersListPageClientProps = {
  players: EnrichedUser[];
};

export const PrivatePlayersListPageClient: React.FC<PrivatePlayersListPageClientProps> = ({ players }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-16">
        <div className="middle-column">
          <h1>Addressliste</h1>
        </div>
        <div className="middle-column flex flex-col space-y-4">
          {players.map((player, index) => {
            return (
              <div key={`user-display-${index}`} className="flex flex-col md:flex-row w-full">
                <div className="flex flex-col w-full">
                  <div>
                    <p className="font-bold">{player.name}</p>
                  </div>
                  <div>
                    <p>{player.email}</p>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div>
                    <p>{player.phone}</p>
                  </div>
                  <div>
                    <p>{player.street}</p>
                  </div>
                  <div>
                    <p>{player.location}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};
