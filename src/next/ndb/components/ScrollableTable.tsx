import React, { useRef, useState, useEffect } from 'react';

interface ScrollableTableProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollableTable: React.FC<ScrollableTableProps> = ({ children, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const checkScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    const isScrollable = scrollWidth > clientWidth;

    setShowLeftShadow(isScrollable && scrollLeft > 0);
    setShowRightShadow(isScrollable && scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Left shadow indicator */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Right shadow indicator */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Scrollable content */}
      <div ref={scrollRef} onScroll={checkScroll} className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export default ScrollableTable;
