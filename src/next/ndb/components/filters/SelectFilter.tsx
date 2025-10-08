import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({ value, onChange, options, placeholder = 'Alle' }) => {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input px-2 py-1.5"
        autoFocus
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
