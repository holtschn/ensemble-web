import Button from '@/next/ndb/components/Button';
import Icon from '@/next/ndb/components/Icon';
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
        <Icon name="filter-active" alt="Filter Active Icon" className="mr-2 h-3 w-3" />
      ) : (
        <Icon name="filter-inactive" alt="Filter Inactive Icon" className="mr-2 h-3 w-3" />
      )}
      {children}
    </Button>
  );
};
