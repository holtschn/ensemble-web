'use client';

import Icon from '@/next/ndb/components/Icon';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: 'search' | 'file' | 'music' | 'folder' | 'alert-circle' | 'info';
  heading: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  variant?: 'no-results' | 'no-data' | 'error';
}

/**
 * EmptyState component to display when no data is available.
 *
 * Features:
 * - Three variants: no-results (search), no-data (empty list), error (error state)
 * - Optional action button
 * - Optional custom content
 * - Responsive and accessible
 *
 * Usage - No search results:
 * ```tsx
 * <EmptyState
 *   variant="no-results"
 *   icon="search"
 *   heading="Keine Ergebnisse"
 *   message="Keine Noten gefunden, die Ihrer Suche entsprechen."
 * />
 * ```
 *
 * Usage - Empty list with action:
 * ```tsx
 * <EmptyState
 *   variant="no-data"
 *   icon="music"
 *   heading="Noch keine Noten vorhanden"
 *   message="Erstellen Sie Ihren ersten Eintrag."
 *   action={{
 *     label: 'Eintrag anlegen',
 *     onClick: () => router.push('/intern/ndb/new')
 *   }}
 * />
 * ```
 *
 * Usage - Error state:
 * ```tsx
 * <EmptyState
 *   variant="error"
 *   icon="alert-circle"
 *   heading="Fehler beim Laden"
 *   message="Die Daten konnten nicht geladen werden."
 *   action={{
 *     label: 'Erneut versuchen',
 *     onClick: () => refetch()
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon = 'file',
  heading,
  message,
  action,
  children,
  variant = 'no-data',
}: EmptyStateProps) {
  const variantStyles = {
    'no-results': {
      iconBg: 'bg-neutral-100',
      iconColor: 'text-neutral-400',
    },
    'no-data': {
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-400',
    },
    error: {
      iconBg: 'bg-danger-100',
      iconColor: 'text-danger-400',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className={`rounded-full ${styles.iconBg} p-3`}>
            <Icon name={icon} alt="" className={`h-8 w-8 ${styles.iconColor}`} />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">{heading}</h2>
        {message && <p className="text-neutral-600 mb-6">{message}</p>}

        {children}

        {action && (
          <button onClick={action.onClick} className="btn-primary btn-md mt-6">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
