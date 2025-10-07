import React, { useRef, useEffect, useState } from 'react';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';

interface FilterPopoverProps {
  isActive: boolean;
  onClear: () => void;
  children: React.ReactNode;
  label: string; // Column label for accessibility
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({ isActive, onClear, children, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; openUpward: boolean } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate position when popover opens
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // After popover is rendered, check its actual height
      let popoverHeight = 250; // default estimate
      if (popoverRef.current) {
        popoverHeight = popoverRef.current.offsetHeight;
      }

      // Open upward if there's not enough space below
      const openUpward = spaceBelow < popoverHeight && spaceAbove > spaceBelow;

      setPosition({
        top: openUpward ? buttonRect.top - popoverHeight - 4 : buttonRect.bottom + 4,
        left: buttonRect.left,
        openUpward,
      });
    };

    // Update position immediately and after a brief delay to account for rendering
    updatePosition();
    const timeoutId = setTimeout(updatePosition, 10);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0 ${
          isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label={`Filter ${label}`}
        aria-expanded={isOpen}
      >
        {isActive ? (
          <Icon name="filter-active" alt="Active filter" className="h-3.5 w-3.5 flex-shrink-0" />
        ) : (
          <Icon name="filter-inactive" alt="Filter" className="h-3.5 w-3.5 flex-shrink-0" />
        )}
      </button>

      {isOpen && position && (
        <div
          ref={popoverRef}
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px] max-h-[400px] overflow-y-auto"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="p-3">
            {children}
          </div>
          {isActive && (
            <div className="border-t border-gray-200 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="w-full text-xs"
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
