import React from 'react';
import { ScoreItem } from '@/next/ndb/types';
import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';

interface ScoreFilesInlineProps {
  score: ScoreItem;
}

const ScoreFilesInline: React.FC<ScoreFilesInlineProps> = ({ score }) => {
  const files = [
    { item: score.parts, label: 'Stimmen' },
    { item: score.fullScore, label: 'Partitur' },
    { item: score.audioMidi, label: 'MIDI' },
    { item: score.audioMp3, label: 'MP3' },
  ];

  return (
    <div className="mt-4">
      <p className="mb-2 ndb-profex-label">Downloads</p>
      <div className="flex flex-wrap gap-2">
        {files.map((file) => (
          <ScoreDownloadButton
            key={file.label}
            file={file.item}
            label={file.label}
            size="sm"
            className="w-28"
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreFilesInline;
