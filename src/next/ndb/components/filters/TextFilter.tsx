import React from 'react';

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextFilter: React.FC<TextFilterProps> = ({ value, onChange, placeholder = 'Filtern...' }) => {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
    </div>
  );
};
