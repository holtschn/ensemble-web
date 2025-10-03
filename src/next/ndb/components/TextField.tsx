import React from 'react';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  error,
  required = false,
  helperText,
  className = '',
  id,
  name,
  ...props
}) => {
  const inputId = id || name || 'textfield';
  const hasError = Boolean(error);

  return (
    <div className="mb-4">
      <input
        type="text"
        id={inputId}
        name={name}
        className={`
          w-full max-w-2xl px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
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

export default TextField;
