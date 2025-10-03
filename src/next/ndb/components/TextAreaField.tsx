import React from 'react';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  error,
  required = false,
  helperText,
  className = '',
  id,
  name,
  rows = 4,
  ...props
}) => {
  const inputId = id || name || 'textareafield';
  const hasError = Boolean(error);

  return (
    <div className="mb-4">
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        className={`
          w-full max-w-3xl px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-y
          ${
            hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }
         
          ${className}
        `.trim()}
        {...props}
      />
      {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !hasError && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default TextAreaField;
