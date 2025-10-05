'use client';

import Icon from '@/next/ndb/components/Icon';

export interface ErrorFallbackProps {
  error?: Error | null;
  onReset?: () => void;
  title?: string;
  message?: string;
  showErrorDetails?: boolean;
}

/**
 * ErrorFallback component to display when an error is caught by ErrorBoundary.
 *
 * Features:
 * - Friendly error message
 * - Optional retry button
 * - Optional error details display (for development)
 * - Accessible and responsive
 *
 * Usage with ErrorBoundary:
 * ```tsx
 * import { ErrorBoundary } from '@/next/components/errorBoundary';
 * import { ErrorFallback } from '@/next/components/errorFallback';
 *
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * With custom message:
 * ```tsx
 * <ErrorBoundary
 *   fallback={
 *     <ErrorFallback
 *       title="Fehler beim Laden der Noten"
 *       message="Die Notendatenbank konnte nicht geladen werden."
 *       showErrorDetails={process.env.NODE_ENV === 'development'}
 *     />
 *   }
 * >
 *   <ScoresTable />
 * </ErrorBoundary>
 * ```
 */
export function ErrorFallback({
  error,
  onReset,
  title = 'Etwas ist schiefgelaufen',
  message = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  showErrorDetails = false,
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <Icon name="alert-circle" alt="" className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {showErrorDetails && error && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md text-left">
            <p className="text-xs font-mono text-gray-800 break-words">
              <strong>Error:</strong> {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Erneut versuchen
          </button>
        )}
      </div>
    </div>
  );
}
