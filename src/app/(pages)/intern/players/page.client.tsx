'use client';

import React from 'react';
import Link from 'next/link';

import { useAuth } from '@/next/auth/context';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';
import { EnrichedUser } from '@/next/utils/users';
import Icon from '@/next/ndb/components/Icon';
import { EmptyState } from '@/next/components/EmptyState';

type PrivatePlayersListPageClientProps = {
  players: EnrichedUser[];
};

export const PrivatePlayersListPageClient: React.FC<PrivatePlayersListPageClientProps> = ({ players }) => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  // Filter out users without instruments
  const playersWithInstruments = players.filter((player) => player.instrumentsString && player.instrumentsString.trim() !== '');

  return (
    status === 'loggedIn' && (
      <div className="flex flex-col mt-8">
        <div className="middle-column mb-6">
          <h1 className="mb-4">Adressliste</h1>
          <Link href="/intern" className="flex items-center ndb-profex-label">
            <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
            <div className="mt-0.5">Zurück zur internen Startseite</div>
          </Link>
        </div>
        <div className="middle-column">
          {playersWithInstruments.length === 0 ? (
            <EmptyState
              variant="no-data"
              icon="music"
              heading="Keine Spieler gefunden"
              message="Es wurden keine Nutzer mit Instrumenten gefunden."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {playersWithInstruments.map((player, index) => {
              return (
                <div
                  key={`user-display-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Left: Name and Instruments */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-base text-gray-900">{player.name}</span>
                        {player.instrumentsString && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Icon name="music" alt="Instruments" className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                            <span>{player.instrumentsString}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Contact Information */}
                    <div className="flex-1 space-y-2">
                      {player.email && (
                        <div className="flex items-start text-sm text-gray-700">
                          <Icon name="mail" alt="Email" className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                          <a href={`mailto:${player.email}`} className="hover:text-gray-900 hover:underline break-all">
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
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    )
  );
};
