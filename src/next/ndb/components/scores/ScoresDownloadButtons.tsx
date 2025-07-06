import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import Button from '@/next/ndb/components/Button';

interface ScoresDownloadButtonsProps {
  score: ScoreItem;
  onDownloadParts?: (score: ScoreItem) => void;
  onDownloadFullScore?: (score: ScoreItem) => void;
}

const ScoresDownloadButtons: React.FC<ScoresDownloadButtonsProps> = ({
  score,
  onDownloadParts,
  onDownloadFullScore,
}) => {
  return (
    <div className="flex space-x-2 justify-end">
      <div className="w-24 text-center">
        {score.parts && onDownloadParts && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadParts(score);
            }}
          >
            Stimmen
          </Button>
        )}
      </div>
      <div className="w-24 text-center">
        {score.fullScore && onDownloadFullScore && (
          <Button
            size="sm"
            variant="outline"
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
  );
};

export default ScoresDownloadButtons;
