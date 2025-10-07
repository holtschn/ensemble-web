'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PlayerAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
}

/**
 * Compact autocomplete input for player names.
 * Shows suggestions from the users collection based on instrument.
 */
const PlayerAutocompleteInput: React.FC<PlayerAutocompleteInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder = '-',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show all suggestions when open (no filtering based on input)
  useEffect(() => {
    if (!isOpen) {
      setFilteredSuggestions([]);
      return;
    }

    // Always show all suggestions (limit to 8)
    setFilteredSuggestions(suggestions.slice(0, 8));
  }, [suggestions, isOpen]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
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
    <div className="relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Suggestions dropdown */}
      {showDropdown && (
        <ul className="absolute z-20 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={`${suggestion}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-2 py-1.5 cursor-pointer text-xs
                ${index === highlightedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-900'}
              `}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerAutocompleteInput;
