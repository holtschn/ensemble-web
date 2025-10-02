import React from 'react';

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  options: readonly string[] | string[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  error,
  required = false,
  helperText,
  className = '',
  id,
  name,
  options,
  ...props
}) => {
  const inputId = id || name || 'selectfield';
  const hasError = Boolean(error);

  return (
    <div className="mb-4">
      <select
        id={inputId}
        name={name}
        className={`
          w-full max-w-xs px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${
            hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
          }
          dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400
          ${className}
        `.trim()}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || '—'}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !hasError && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
};

export default SelectField;
