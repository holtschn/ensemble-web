'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

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
  const [shouldFlipUpward, setShouldFlipUpward] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Show all suggestions when open (no filtering based on input)
  useEffect(() => {
    if (!isOpen) {
      setFilteredSuggestions([]);
      return;
    }

    // Always show all suggestions (limit to 8)
    setFilteredSuggestions(suggestions.slice(0, 8));
  }, [suggestions, isOpen]);

  // Calculate dropdown position using fixed positioning
  const updateDropdownPosition = useCallback(() => {
    if (!wrapperRef.current || !inputRef.current) {
      return;
    }

    const inputRect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.scrollHeight || 192; // Default max-h-48 = 192px
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    // Flip upward if not enough space below but enough space above
    const shouldFlip = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    setShouldFlipUpward(shouldFlip);

    // Calculate position
    setDropdownPosition({
      top: shouldFlip ? inputRect.top - 4 : inputRect.bottom + 4,
      left: inputRect.left,
      width: inputRect.width,
    });
  }, []);

  // Update position when opening or when suggestions change
  useEffect(() => {
    if (!isOpen) {
      setDropdownPosition(null);
      return;
    }

    updateDropdownPosition();
  }, [isOpen, filteredSuggestions, updateDropdownPosition]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updateDropdownPosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updateDropdownPosition]);

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
        className="w-full px-2 py-1 text-caption border border-neutral-300 rounded-base focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      />

      {/* Suggestions dropdown - fixed positioning to avoid overflow issues */}
      {showDropdown && dropdownPosition && (
        <ul
          ref={dropdownRef}
          className="fixed z-20 bg-white border-popover max-h-48 overflow-auto"
          style={{
            top: shouldFlipUpward ? 'auto' : `${dropdownPosition.top}px`,
            bottom: shouldFlipUpward ? `${window.innerHeight - dropdownPosition.top}px` : 'auto',
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={`${suggestion}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                px-2 py-1.5 cursor-pointer text-caption
                ${index === highlightedIndex ? 'bg-highlight text-highlight' : 'hover:bg-neutral-50 text-neutral-900'}
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
