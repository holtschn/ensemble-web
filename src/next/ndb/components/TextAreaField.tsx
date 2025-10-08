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
        className={`input max-w-3xl resize-y ${hasError ? 'input-error' : ''} ${className}`.trim()}
        {...props}
      />
      {hasError && <p className="input-error-text">{error}</p>}
      {helperText && !hasError && <p className="input-helper">{helperText}</p>}
    </div>
  );
};

export default TextAreaField;
