import React from 'react';

interface DisplayFieldProps {
  label: string;
  value: React.ReactNode;
  multiline?: boolean;
  className?: string;
}

/**
 * A read-only component for displaying a label and its corresponding value.
 * Designed for use in detail/display views.
 */
const DisplayField: React.FC<DisplayFieldProps> = ({ label, value, multiline = false, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      {multiline ? (
        <div className="w-full p-2 min-h-[6rem] whitespace-pre-wrap">
          <p>{value || '-'}</p>
        </div>
      ) : (
        <div className="w-full p-2">
          <p className="truncate">{value || '-'}</p>
        </div>
      )}
    </div>
  );
};

export default DisplayField;
