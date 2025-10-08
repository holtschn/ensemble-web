import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import Button from '@/next/ndb/components/Button';

interface ScoresMobileCardProps {
  score: ScoreItem;
  onScoreClick?: (score: ScoreItem) => void;
  onDownloadParts?: (score: ScoreItem) => void;
  onDownloadFullScore?: (score: ScoreItem) => void;
}

const ScoresMobileCard: React.FC<ScoresMobileCardProps> = ({
  score,
  onScoreClick,
  onDownloadParts,
  onDownloadFullScore,
}) => {
  return (
    <div className="border-b px-3 py-2 cursor-pointer" onClick={() => onScoreClick?.(score)}>
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{score.title}</div>
          <div className="text-caption truncate">{score.composer}</div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {score.parts && onDownloadParts && (
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadParts(score);
              }}
            >
              Stimmen
            </Button>
          )}
          {score.fullScore && onDownloadFullScore && (
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadFullScore(score);
              }}
            >
              Partitur
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ScoresMobileViewProps {
  scores: ScoreItem[];
  isLoading?: boolean;
  onScoreClick?: (score: ScoreItem) => void;
  onDownloadParts?: (score: ScoreItem) => void;
  onDownloadFullScore?: (score: ScoreItem) => void;
}

const ScoresMobileView: React.FC<ScoresMobileViewProps> = ({
  scores,
  onScoreClick,
  onDownloadParts,
  onDownloadFullScore,
}) => {
  if (scores.length === 0) {
    return <div className="text-center p-8">Keine Noten gefunden</div>;
  }

  return (
    <div className="divide-y border-t">
      {scores.map((score) => (
        <ScoresMobileCard
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
