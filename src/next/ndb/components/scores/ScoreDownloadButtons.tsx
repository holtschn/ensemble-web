import React from 'react';

import { ScoreFileItem, ScoreItem } from '@/next/ndb/types';

import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';

const FileDownloadButton: React.FC<{ file: ScoreFileItem | null; label: string }> = ({ file, label }) => {
  const isDisabled = !file;

  const handleClick = () => {
    // In a real app, you would get a signed URL from the backend
    if (file) {
      console.log(`Downloading ${file.filename}`);
      // window.open(file.url, '_blank');
    }
  };

  return (
    <Button variant="outline" className="w-full" disabled={isDisabled} onClick={handleClick}>
      <Icon name="download" alt="Download" className="mr-2 h-3 w-3" />
      {label}
    </Button>
  );
};

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
            <FileDownloadButton key={label} file={file} label={label} />
          ))}
        </div>
      ) : (
        <p>Keine Dateien vorhanden.</p>
      )}
    </div>
  );
};

export default FilesCard;
