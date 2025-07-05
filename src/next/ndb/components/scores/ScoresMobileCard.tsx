import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import { toInstrumentation } from '@/next/ndb/utils/instrumentation';
import Button from '@/next/ndb/components/Button';

interface MobileCardProps {
  score: ScoreItem;
  onScoreClick?: (score: ScoreItem) => void;
  onDownloadParts?: (score: ScoreItem) => void;
  onDownloadFullScore?: (score: ScoreItem) => void;
}

const MobileCard: React.FC<MobileCardProps> = ({ score, onScoreClick, onDownloadParts, onDownloadFullScore }) => {
  return (
    <div className="border-b px-4 py-4 cursor-pointer" onClick={() => onScoreClick?.(score)}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-lg">{score.title}</div>
          <div className="text-sm text-gray-600">{score.composer}</div>
        </div>
        <div className="text-right text-sm font-mono pl-2 flex-shrink-0">
          {toInstrumentation(score.instrumentation).renderValue()}
        </div>
      </div>
      <div className="flex mt-4 justify-end space-x-2">
        <div style={{ minWidth: '90px' }} className="text-right">
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
        <div style={{ minWidth: '90px' }} className="text-right">
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
    </div>
  );
};

export default MobileCard;
