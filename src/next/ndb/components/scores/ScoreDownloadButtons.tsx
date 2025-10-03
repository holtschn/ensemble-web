import React from 'react';

import { ScoreFileItem, ScoreItem } from '@/next/ndb/types';

import ScoreDownloadButton from '@/next/ndb/components/ScoreDownloadButton';

const FilesCard: React.FC<{ score: ScoreItem }> = ({ score }) => {
  const files = [
    { file: score.parts, label: 'Stimmen' },
    { file: score.fullScore, label: 'Partitur' },
    { file: score.audioMidi, label: 'Audio (MIDI)' },
    { file: score.audioMp3, label: 'Audio (MP3)' },
  ];

  const availableFiles = files.filter((f) => f.file);

  return (
    <div>
      <p className="mb-2 ndb-profex-label">Downloads</p>
      {availableFiles.length > 0 ? (
        <div className="flex flex-col gap-y-2">
          {files.map(({ file, label }) => (
            <ScoreDownloadButton key={label} file={file} label={label} className="w-full" />
          ))}
        </div>
      ) : (
        <p>Keine Dateien vorhanden.</p>
      )}
    </div>
  );
};

export default FilesCard;
