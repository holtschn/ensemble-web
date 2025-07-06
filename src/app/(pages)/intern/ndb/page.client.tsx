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
