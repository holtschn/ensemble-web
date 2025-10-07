import React from 'react';

interface BooleanFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanFilter: React.FC<BooleanFilterProps> = ({
  value,
  onChange,
  trueLabel = 'Ja',
  falseLabel = 'Nein',
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          checked={value === true}
          onChange={() => onChange(true)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{trueLabel}</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          checked={value === false}
          onChange={() => onChange(false)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{falseLabel}</span>
      </label>
    </div>
  );
};
