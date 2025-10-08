import React from 'react';

import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';

interface ActionCardProps {
  isEditMode: boolean;
  onEditClick: () => void;
  disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ isEditMode, onEditClick, disabled = false }) => {
  if (isEditMode) {
    // In edit mode, actions are handled by the form itself
    return null;
  }

  return (
    <div className="p-4 border-card bg-white">
      <Button onClick={onEditClick} disabled={disabled} variant="default" className="w-full">
        <Icon name="edit" alt="Edit Icon" className="mr-2" />
        Eintrag ändern
      </Button>
    </div>
  );
};

export default ActionCard;
