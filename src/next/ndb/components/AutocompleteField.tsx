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
      .filter((suggestion) => suggestion && suggestion.toLowerCase().includes(inputValue))
      .slice(0, 5); // Limit to 5 suggestions

    setFilteredSuggestions(filtered as string[]);
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
        setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
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
        className={`input max-w-2xl ${hasError ? 'input-error' : ''} ${className}`.trim()}
        {...props}
      />

      {/* Suggestions dropdown */}
      {showDropdown && (
        <ul className="absolute z-10 w-full max-w-2xl mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={`${suggestion}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-3 py-2 cursor-pointer transition-colors text-neutral-900 ${index === highlightedIndex ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {hasError && <p className="input-error-text">{error}</p>}
      {helperText && !hasError && <p className="input-helper">{helperText}</p>}
    </div>
  );
};

export default AutocompleteField;
