import React, { useState, useEffect } from 'react';
import Button from '@/next/ndb/components/Button';
import Icon from '@/next/ndb/components/Icon';
import { ColumnConfig, DEFAULT_COLUMNS } from '@/next/ndb/types/columns';

interface ColumnSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onSave: (columns: ColumnConfig[]) => void;
}

export const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  isOpen,
  onClose,
  columns: initialColumns,
  onSave,
}) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleToggle = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId && !col.alwaysVisible ? { ...col, visible: !col.visible } : col))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setColumns((prev) => {
      const newColumns = [...prev];
      [newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
      // Update order numbers
      return newColumns.map((col, idx) => ({ ...col, order: idx }));
    });
  };

  const handleMoveDown = (index: number) => {
    setColumns((prev) => {
      if (index >= prev.length - 1) return prev;
      const newColumns = [...prev];
      [newColumns[index], newColumns[index + 1]] = [newColumns[index + 1], newColumns[index]];
      // Update order numbers
      return newColumns.map((col, idx) => ({ ...col, order: idx }));
    });
  };

  const handleReset = () => {
    setColumns(DEFAULT_COLUMNS);
  };

  const handleSave = () => {
    onSave(columns);
    onClose();
  };

  const handleCancel = () => {
    setColumns(initialColumns);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="rounded-card shadow-xl p-0 backdrop:bg-black/30 max-w-md w-full m-auto"
      onClose={handleCancel}
      aria-labelledby="column-settings-title"
    >
      <div className="bg-white rounded-card">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200">
          <h2 id="column-settings-title" className="font-semibold text-neutral-900">
            Spalten anzeigen
          </h2>
          <button
            onClick={handleCancel}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Schließen"
          >
            <Icon name="cross" alt="Schließen" className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-3 py-2 max-h-96 overflow-y-auto">
          <div className="space-y-0">
            {columns.map((column, index) => (
              <div
                key={column.id}
                className={`flex items-center space-x-1.5 py-0.5 px-1.5 rounded ${
                  !column.alwaysVisible ? 'hover:bg-neutral-50' : 'opacity-50'
                } transition-colors`}
              >
                {/* Reorder buttons */}
                <div className="flex flex-col -space-y-2">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-0 hover:bg-neutral-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Nach oben"
                  >
                    <Icon name="chevron-down" alt="Up" className="h-2.5 w-2.5 transform rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === columns.length - 1}
                    className="p-0 hover:bg-neutral-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Nach unten"
                  >
                    <Icon name="chevron-down" alt="Down" className="h-2.5 w-2.5" />
                  </button>
                </div>

                {/* Checkbox and label */}
                <label
                  className={`flex items-center space-x-2 flex-1 ${
                    column.alwaysVisible ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    disabled={column.alwaysVisible}
                    onChange={() => handleToggle(column.id)}
                    className="w-3.5 h-3.5 border-neutral-300 rounded focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ accentColor: 'var(--color-primary-500)' }}
                  />
                  <span className="text-body">
                    {column.label}
                    {column.alwaysVisible && <span className="ml-1.5 text-caption text-neutral-400">(immer sichtbar)</span>}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-200 bg-neutral-50 rounded-b-lg">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Zurücksetzen
          </Button>
          <div className="flex space-x-2">
            <Button variant="default" size="sm" onClick={handleCancel}>
              Abbrechen
            </Button>
            <Button variant="highlighted" size="sm" onClick={handleSave}>
              Speichern
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
