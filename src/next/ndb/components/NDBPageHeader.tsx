import React, { ReactNode } from 'react';
import Link from 'next/link';
import Icon from '@/next/ndb/components/Icon';

interface NDBPageHeaderProps {
  title: string;
  backLink?: {
    href: string;
    label: string;
  };
  action?: ReactNode;
  statusMessage?: ReactNode;
}

/**
 * Generic page header for NDB pages with consistent layout.
 *
 * Pattern:
 * - Title (h1)
 * - Back link on the left
 * - Action button(s) on the right
 * - Optional status message between back link and action
 *
 * Usage:
 * ```tsx
 * <NDBPageHeader
 *   title="Notendatenbank"
 *   backLink={{ href: '/intern', label: 'Zurück zur internen Startseite' }}
 *   action={<Button onClick={handleCreate}>Eintrag anlegen</Button>}
 * />
 * ```
 */
export const NDBPageHeader: React.FC<NDBPageHeaderProps> = ({ title, backLink, action, statusMessage }) => {
  return (
    <div className="middle-column mb-8">
      <h1 className="mb-4">{title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {backLink && (
          <Link href={backLink.href} className="flex items-center ndb-profex-label">
            <Icon name="arrow-left" alt="Back" className="mr-2 h-3 w-3" />
            <div className="mt-0.5">{backLink.label}</div>
          </Link>
        )}
        {(action || statusMessage) && (
          <div className="ml-auto flex items-center gap-4">
            {statusMessage}
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
