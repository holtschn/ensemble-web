import { Suspense } from 'react';
import { AuthProvider } from '@/next/auth/context';
import { ErrorBoundary } from '@/next/components/ErrorBoundary';
import { ErrorFallback } from '@/next/components/ErrorFallback';

import Loading from './loading';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}
