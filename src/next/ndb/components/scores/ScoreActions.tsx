import React from 'react';
import Icon from '@/next/ndb/components/Icon';

interface ScoreActionsProps {
  isEditMode: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

const ScoreActions: React.FC<ScoreActionsProps> = ({
  isEditMode,
  isSaving,
  hasChanges,
  onEditClick,
  onSaveClick,
  onCancelClick,
}) => {
  if (isEditMode) {
    return (
      <div className="flex gap-2 max-w-sm">
        <button
          type="button"
          onClick={onSaveClick}
          disabled={isSaving || !hasChanges}
          className="flex items-center px-4 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Icon name="check" alt="Save" className="mr-1.5 h-3.5 w-3.5" />
          {isSaving ? 'Speichern...' : 'Speichern'}
        </button>
        <button
          type="button"
          onClick={onCancelClick}
          disabled={isSaving}
          className="flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Icon name="cross" alt="Cancel" className="mr-1.5 h-3.5 w-3.5" />
          Abbrechen
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onEditClick}
      className="flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 max-w-xs"
    >
      <Icon name="edit" alt="Edit" className="mr-1.5 h-3.5 w-3.5" />
      Bearbeiten
    </button>
  );
};

export default ScoreActions;
