'use client';

import { Toaster } from 'sonner';

/**
 * ToastProvider component that wraps the Sonner toast notification system.
 *
 * Usage in app layout:
 * ```tsx
 * import { ToastProvider } from '@/next/components/toastProvider';
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ToastProvider />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * Usage in components:
 * ```tsx
 * import { toast } from 'sonner';
 *
 * // Success toast
 * toast.success('Noten erfolgreich gespeichert');
 *
 * // Error toast
 * toast.error('Fehler beim Laden der Daten');
 *
 * // Info toast
 * toast.info('Datei wird heruntergeladen...');
 *
 * // Promise toast (for async operations)
 * toast.promise(
 *   saveData(),
 *   {
 *     loading: 'Wird gespeichert...',
 *     success: 'Erfolgreich gespeichert',
 *     error: 'Fehler beim Speichern',
 *   }
 * );
 * ```
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'inherit',
        },
        className: 'toast',
      }}
    />
  );
}
