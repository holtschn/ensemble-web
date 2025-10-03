'use client';

import React from 'react';

import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EnrichedUser } from '@/next/utils/users';
import Icon from '@/next/ndb/components/Icon';

type PrivatePlayersListPageClientProps = {
  players: EnrichedUser[];
};

export const PrivatePlayersListPageClient: React.FC<PrivatePlayersListPageClientProps> = ({ players }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-6">
          <h1>Adressliste</h1>
          <p className="text-sm text-gray-600 mt-2">{players.length} Mitglieder</p>
        </div>
        <div className="middle-column">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, index) => {
              return (
                <div
                  key={`user-display-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Name and Instruments */}
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <h3 className="font-semibold text-base text-gray-900 mb-1">{player.name}</h3>
                    {player.instrumentsString && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Icon name="music" alt="Instruments" className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>{player.instrumentsString}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    {player.email && (
                      <div className="flex items-start text-sm text-gray-700">
                        <Icon name="mail" alt="Email" className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                        <a
                          href={`mailto:${player.email}`}
                          className="hover:text-gray-900 hover:underline break-all"
                        >
                          {player.email}
                        </a>
                      </div>
                    )}
                    {player.phone && (
                      <div className="flex items-start text-sm text-gray-700">
                        <Icon name="phone" alt="Phone" className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                        <a href={`tel:${player.phone}`} className="hover:text-gray-900 hover:underline">
                          {player.phone}
                        </a>
                      </div>
                    )}
                    {(player.street || player.location) && (
                      <div className="flex items-start text-sm text-gray-700">
                        <Icon name="map-pin" alt="Address" className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          {player.street && <span>{player.street}</span>}
                          {player.location && <span>{player.location}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};
