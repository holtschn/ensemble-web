'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import { useScores } from '@/next/ndb/hooks/useScores';
import { ScoreItem } from '@/next/ndb/types';

import ScoresTable from '@/next/ndb/components/scores/ScoresTable';
import ScoresTableToolbar from '@/next/ndb/components/scores/ScoresTableToolbar';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import Icon from '@/next/ndb/components/Icon';
import { useAuth } from '@/next/auth/context';
import { EmptyState } from '@/next/components/EmptyState';

export const ScoresPageClient: React.FC = () => {
  const { status } = useAuth();
  useRedirectIfLoggedOut();

  const router = useRouter();
  const { scores, isLoading } = useScores();
  const [filteredScores, setFilteredScores] = useState<ScoreItem[]>([]);
  const [hasActiveColumnFilters, setHasActiveColumnFilters] = useState(false);
  const columnFiltersResetRef = React.useRef<(() => void) | null>(null);

  // Update filtered scores when main scores data changes
  React.useEffect(() => {
    setFilteredScores(scores);
  }, [scores]);

  const handleScoreClick = useCallback(
    (score: ScoreItem) => {
      router.push(`/intern/ndb/${score.id}`);
    },
    [router]
  );

  const handleCreateClick = useCallback(() => {
    router.push('/intern/ndb/new');
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!scores || scores.length < 1) {
    return (
      <div className="middle-column mt-8">
        <Link href="/intern" className="flex items-center ndb-profex-label mb-4">
          <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
          <div className="mt-0.5">Zurück zur internen Startseite</div>
        </Link>
        <EmptyState
          variant="no-data"
          icon="music"
          heading="Noch keine Noten vorhanden"
          message="Erstellen Sie Ihren ersten Eintrag in der Notendatenbank."
          action={{
            label: 'Eintrag anlegen',
            onClick: handleCreateClick,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-8">
      <div className="middle-column mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1>Notendatenbank</h1>
          <button
            onClick={handleCreateClick}
            className="hidden md:flex items-center px-4 py-1.5 mt-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Icon name="plus-circle" alt="Create" className="mr-1.5 h-3.5 w-3.5" />
            Eintrag anlegen
          </button>
        </div>
        <Link href="/intern" className="flex items-center ndb-profex-label">
          <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
          <div className="mt-0.5">Zurück zur internen Startseite</div>
        </Link>
      </div>
      <div className="middle-column flex flex-row">
        <ScoresTableToolbar
          scores={scores}
          onFilteredScoresChange={setFilteredScores}
          hasActiveColumnFilters={hasActiveColumnFilters}
          onResetAllFilters={() => {
            columnFiltersResetRef.current?.();
          }}
        />
      </div>
      {filteredScores.length === 0 && scores.length > 0 ? (
        <div className="middle-column">
          <EmptyState
            variant="no-results"
            icon="search"
            heading="Keine Ergebnisse"
            message="Keine Noten gefunden, die Ihren Suchkriterien entsprechen. Versuchen Sie, die Filter zurückzusetzen."
          />
        </div>
      ) : (
        <ScoresTable
          scores={filteredScores}
          onScoreClick={handleScoreClick}
          onColumnFiltersChange={setHasActiveColumnFilters}
          onResetColumnFilters={(clearFn) => {
            columnFiltersResetRef.current = clearFn;
          }}
        />
      )}
    </div>
  );
};
