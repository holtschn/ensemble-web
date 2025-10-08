import React from 'react';

interface FileFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const FileFilter: React.FC<FileFilterProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          checked={value === true}
          onChange={() => onChange(true)}
          className="w-4 h-4 border-neutral-300 focus:ring-2"
          style={{ accentColor: 'var(--color-primary-500)' }}
        />
        <span className="text-sm text-neutral-700">Vorhanden</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          checked={value === false}
          onChange={() => onChange(false)}
          className="w-4 h-4 border-neutral-300 focus:ring-2"
          style={{ accentColor: 'var(--color-primary-500)' }}
        />
        <span className="text-sm text-neutral-700">Nicht vorhanden</span>
      </label>
    </div>
  );
};
