'use client';

import React, { useState, useCallback } from 'react';
import { useScores } from '@/next/ndb/hooks/useScores';
import { ScoreItem } from '@/next/ndb/types';
import ScoresTable from '@/next/ndb/components/table/ScoresTable';
import ScoresTableToolbar from '@/next/ndb/components/table/ScoresTableToolbar';

export const ScoresPageClient: React.FC = () => {
  const { scores, isLoading, error } = useScores();
  const [filteredScores, setFilteredScores] = useState<ScoreItem[]>([]);

  // Update filtered scores when main scores data changes
  React.useEffect(() => {
    setFilteredScores(scores);
  }, [scores]);

  const handleScoreClick = useCallback((score: ScoreItem) => {
    console.log('Score clicked:', score);
    // TODO: Navigate to score details page
    // router.push(`/ndb/scores/${score.id}`);
  }, []);

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
        <ScoresTableToolbar scores={scores} onFilteredScoresChange={setFilteredScores} isLoading={isLoading} />
      </div>

      <ScoresTable
        scores={filteredScores}
        isLoading={isLoading}
        onScoreClick={handleScoreClick}
        onDownloadParts={handleDownloadParts}
        onDownloadFullScore={handleDownloadFullScore}
      />
    </div>
  );
};
