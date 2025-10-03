'use client';

import React, { useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';
import useRedirectIfLoggedOut from '@/next/auth/loggedInHook';

import { useScores } from '@/next/ndb/hooks/useScores';
import { ScoreItem } from '@/next/ndb/types';

import ScoresTable from '@/next/ndb/components/scores/ScoresTable';
import ScoresTableToolbar from '@/next/ndb/components/scores/ScoresTableToolbar';
import LoadingSpinner from '@/next/ndb/components/LoadingSpinner';

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

  const handleUploadClick = useCallback(() => {
    router.push('/intern/ndb/upload');
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
      <div className="middle-column">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-2xl sm:text-3xl">Notendatenbank</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleUploadClick}
              className="flex items-center justify-center flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <span className="mr-1.5">↑</span>
              Aus PDF
            </button>
            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
            >
              <span className="mr-1.5">+</span>
              Neuer Eintrag
            </button>
          </div>
        </div>
      </div>
      <div className="middle-column flex flex-row">
        <ScoresTableToolbar scores={scores} onFilteredScoresChange={setFilteredScores} />
      </div>
      <ScoresTable scores={filteredScores} onScoreClick={handleScoreClick} />
    </div>
  );
};
