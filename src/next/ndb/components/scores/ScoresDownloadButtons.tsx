import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';

interface ScoresDownloadButtonsProps {
  score: ScoreItem;
}

const ScoresDownloadButtons: React.FC<ScoresDownloadButtonsProps> = ({ score }) => {
  const hasParts = score.parts !== null;
  const hasFullScore = score.fullScore !== null;

  // If no files, show placeholder
  if (!hasParts && !hasFullScore) {
    return <div className="text-sm text-gray-400">-</div>;
  }

  return (
    <div className="flex space-x-2 justify-end">
      {hasParts && <ScoreDownloadButton file={score.parts} label="Stimmen" size="sm" className="min-w-[90px]" />}
      {hasFullScore && (
        <ScoreDownloadButton file={score.fullScore} label="Partitur" size="sm" className="min-w-[90px]" />
      )}
    </div>
  );
};

export default ScoresDownloadButtons;
