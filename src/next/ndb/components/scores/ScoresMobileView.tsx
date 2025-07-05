import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import MobileCard from './ScoresMobileCard';

interface ScoresMobileViewProps {
  scores: ScoreItem[];
  isLoading?: boolean;
  onScoreClick?: (score: ScoreItem) => void;
  onDownloadParts?: (score: ScoreItem) => void;
  onDownloadFullScore?: (score: ScoreItem) => void;
}

const ScoresMobileView: React.FC<ScoresMobileViewProps> = ({
  scores,
  isLoading = false,
  onScoreClick,
  onDownloadParts,
  onDownloadFullScore,
}) => {
  if (isLoading) {
    return <div className="text-center p-8">Lade Noten...</div>;
  }

  if (scores.length === 0) {
    return <div className="text-center p-8">Keine Noten gefunden</div>;
  }

  return (
    <div className="divide-y border-t">
      {scores.map((score) => (
        <MobileCard
          key={score.id}
          score={score}
          onScoreClick={onScoreClick}
          onDownloadParts={onDownloadParts}
          onDownloadFullScore={onDownloadFullScore}
        />
      ))}
    </div>
  );
};

export default ScoresMobileView;
