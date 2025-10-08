import React from 'react';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ error, required = false, helperText, className = '', id, name, ...props }, ref) => {
    const inputId = id || name || 'textfield';
    const hasError = Boolean(error);

    return (
      <div className="mb-4">
        <input
          ref={ref}
          type="text"
          id={inputId}
          name={name}
          className={`input max-w-2xl ${hasError ? 'input-error' : ''} ${className}`.trim()}
          {...props}
        />
        {hasError && <p className="input-error-text">{error}</p>}
        {helperText && !hasError && <p className="input-helper">{helperText}</p>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
