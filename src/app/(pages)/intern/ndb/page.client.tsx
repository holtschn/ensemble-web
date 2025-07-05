'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useScores } from '@/next/ndb/hooks/useScores';
import { ScoreItem } from '@/next/ndb/types';
import ScoresTable from '@/next/ndb/components/scores/ScoresTable';
import ScoresTableToolbar from '@/next/ndb/components/scores/ScoresTableToolbar';

export const ScoresPageClient: React.FC = () => {
  const router = useRouter();
  const { scores, isLoading, error } = useScores();
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

  const handleDownloadParts = useCallback((score: ScoreItem) => {
    if (score.parts) {
      console.log('Download parts for:', score.title);
      // TODO: Implement file download
      // window.open(score.parts.url, '_blank');
    }
  }, []);

  const handleDownloadFullScore = useCallback((score: ScoreItem) => {
    if (score.fullScore) {
      console.log('Download full score for:', score.title);
      // TODO: Implement file download
      // window.open(score.fullScore.url, '_blank');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mt-16">
        <div className="middle-column">
          <h2>Fehler beim Laden der Noten</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-16">
      <div className="middle-column">
        <h1>Notendatenbank</h1>
      </div>
      <div className="middle-column flex flex-row">
        <ScoresTableToolbar scores={scores} onFilteredScoresChange={setFilteredScores} />
      </div>
      <ScoresTable
        scores={filteredScores}
        onScoreClick={handleScoreClick}
        onDownloadParts={handleDownloadParts}
        onDownloadFullScore={handleDownloadFullScore}
      />
    </div>
  );
};
