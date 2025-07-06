import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';

interface ScoresDownloadButtonsProps {
  score: ScoreItem;
}

const ScoresDownloadButtons: React.FC<ScoresDownloadButtonsProps> = ({ score }) => {
  return (
    <div className="flex space-x-2 justify-end">
      <div className="w-24 text-center">
        {score.parts && <ScoreDownloadButton file={score.parts} label="Stimmen" size="sm" className="w-full" />}
      </div>
      <div className="w-24 text-center">
        {score.fullScore && (
          <ScoreDownloadButton file={score.fullScore} label="Partitur" size="sm" className="w-full" />
        )}
      </div>
    </div>
  );
};

export default ScoresDownloadButtons;
