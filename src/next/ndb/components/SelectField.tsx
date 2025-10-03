import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

interface SelectFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  options: readonly string[] | string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  error,
  required = false,
  helperText,
  className = '',
  id,
  name,
  options,
  value = '',
  onChange,
  disabled = false,
}) => {
  const inputId = id || name || 'selectfield';
  const hasError = Boolean(error);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      // Reset highlighted index when opening
      if (!isOpen) {
        const currentIndex = options.indexOf(value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : -1);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { name, value: option },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsOpen(true);
      const currentIndex = options.indexOf(value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleOptionClick(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const displayValue = value || '—';

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        id={inputId}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full max-w-xs px-3 py-2 border rounded-md shadow-sm text-left
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${
            hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }
         
          flex items-center justify-between
          ${className}
        `.trim()}
      >
        <span>{displayValue}</span>
        <Icon
          name="chevron-down"
          alt="Dropdown"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Options dropdown */}
      {isOpen && (
        <ul className="absolute z-10 w-full max-w-xs mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-3 py-2 cursor-pointer transition-colors
                ${
                  index === highlightedIndex
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }
                ${option === value ? 'font-medium' : ''}
                text-gray-900
              `}
            >
              {option || '—'}
            </li>
          ))}
        </ul>
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !hasError && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default SelectField;
