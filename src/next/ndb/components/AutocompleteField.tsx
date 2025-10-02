import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useScores } from '@/next/ndb/hooks/useScores';

interface AutocompleteFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'list'> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  fieldName?: 'composer' | 'arranger' | 'publisher';
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  error,
  required = false,
  helperText,
  fieldName,
  className = '',
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const inputId = id || name || 'autocompletefield';
  const hasError = Boolean(error);

  const { scores } = useScores();

  // Extract unique values for autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!fieldName) return [];
    const unique = new Set(scores.map((s) => s[fieldName]).filter(Boolean));
    return Array.from(unique).sort();
  }, [scores, fieldName]);

  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (!value || typeof value !== 'string') {
      setFilteredSuggestions([]);
      return;
    }

    const inputValue = value.toLowerCase();
    const filtered = suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(inputValue))
      .slice(0, 5); // Limit to 5 suggestions

    setFilteredSuggestions(filtered);
  }, [value, suggestions]);

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

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    onFocus?.(e);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { name, value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const showDropdown = isOpen && filteredSuggestions.length > 0;

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className={`
          w-full max-w-2xl px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${
            hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
          }
          dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400
          ${className}
        `.trim()}
        {...props}
      />

      {/* Suggestions dropdown */}
      {showDropdown && (
        <ul className="absolute z-10 w-full max-w-2xl mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-600">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={`${suggestion}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-3 py-2 cursor-pointer transition-colors
                ${
                  index === highlightedIndex
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                }
                text-gray-900 dark:text-gray-100
              `}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !hasError && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
};

export default AutocompleteField;
