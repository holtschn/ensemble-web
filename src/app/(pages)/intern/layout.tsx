import { Suspense } from 'react';
import { AuthProvider } from '@/next/auth/context';

import Loading from './loading';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </AuthProvider>
  );
}
