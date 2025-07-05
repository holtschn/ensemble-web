import Button from '@/next/ndb/components/Button';
import Image from 'next/image';
import React from 'react';

type FilterButtonProps = {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export const FilterButton: React.FC<FilterButtonProps> = ({ isActive, onClick, children }) => {
  return (
    <Button size="sm" className="text-xs" variant={isActive ? 'primary' : 'outline'} onClick={onClick}>
      {isActive ? (
        <Image src="/filter-active.svg" alt="Filter Active Icon" width={8} height={8} className="mr-2 h-3 w-3" />
      ) : (
        <Image src="/filter-inactive.svg" alt="Filter Inactive Icon" width={8} height={8} className="mr-2 h-3 w-3" />
      )}
      {children}
    </Button>
  );
};
