import React from 'react';
import Icon from '@/next/ndb/components/Icon';
import Button from '@/next/ndb/components/Button';

interface ScoreActionsProps {
  isEditMode: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
}

const ScoreActions: React.FC<ScoreActionsProps> = ({ isEditMode, isSaving, hasChanges, onEditClick, onSaveClick }) => {
  if (isEditMode) {
    return (
      <div className="flex gap-2 max-w-sm">
        <Button
          type="button"
          onClick={onSaveClick}
          disabled={isSaving || !hasChanges}
          variant="highlighted"
          size="sm"
          isLoading={isSaving}
        >
          <Icon name="check" alt="Save" className="mr-1.5 h-3.5 w-3.5" />
          Speichern
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={onEditClick}
      variant="default"
      size="sm"
    >
      <Icon name="edit" alt="Edit" className="mr-1.5 h-3.5 w-3.5" />
      Bearbeiten
    </Button>
  );
};

export default ScoreActions;
