'use client';

import { useEffect, useRef } from 'react';
import Icon from '@/next/ndb/components/Icon';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * ConfirmDialog component for user confirmations.
 *
 * Features:
 * - Accessible (ARIA labels, focus trap, ESC to close)
 * - Native HTML dialog element
 * - Three variants: danger (red), warning (yellow), info (blue)
 * - Backdrop click to close
 *
 * Usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={() => {
 *     deleteItem();
 *     setIsOpen(false);
 *   }}
 *   title="Eintrag löschen?"
 *   message="Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
 *   confirmText="Löschen"
 *   cancelText="Abbrechen"
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  variant = 'danger',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  const variantStyles = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-600',
      iconName: 'alert-circle' as const,
    },
    warning: {
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: 'text-yellow-600',
      iconName: 'alert-triangle' as const,
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-600',
      iconName: 'info' as const,
    },
  };

  const styles = variantStyles[variant];

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg shadow-xl p-0 backdrop:bg-black backdrop:bg-opacity-50 max-w-md w-full"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <Icon name={styles.iconName} alt="" className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 id="dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h2>
            <p id="dialog-message" className="text-sm text-gray-600 mb-6">
              {message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
