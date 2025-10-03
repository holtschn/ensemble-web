'use client';

import React, { useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import { useScores } from '@/next/ndb/hooks/useScores';
import { ScoreItem } from '@/next/ndb/types';

import ScoresTable from '@/next/ndb/components/scores/ScoresTable';
import ScoresTableToolbar from '@/next/ndb/components/scores/ScoresTableToolbar';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';
import Icon from '@/next/ndb/components/Icon';

export const ScoresPageClient: React.FC = () => {
  useRedirectIfLoggedOut();

  const router = useRouter();
  const { scores, isLoading } = useScores();
  const [filteredScores, setFilteredScores] = useState<ScoreItem[]>([]);

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
        <h1>Keine Noten gefunden</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-8">
      <div className="middle-column mb-4">
        <div className="flex items-center justify-between">
          <h1>Notendatenbank</h1>
          <button
            onClick={handleCreateClick}
            className="hidden md:flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Icon name="plus-circle" alt="Create" className="mr-1.5 h-3.5 w-3.5" />
            Eintrag anlegen
          </button>
        </div>
      </div>
      <div className="middle-column flex flex-row">
        <ScoresTableToolbar scores={scores} onFilteredScoresChange={setFilteredScores} />
      </div>
      <ScoresTable scores={filteredScores} onScoreClick={handleScoreClick} />
    </div>
  );
};
