import { Suspense } from 'react';
import { AuthProvider } from '@/next/auth/context';

import Loading from './loading';

/*
 * interestingly the 'force-dynamic' is needed because the rendering of all interal pages is dependent on the login state of the user.
 * Without 'force-dynamic' NEXTjs generates static pages that are empty because they only render content when the user is logged in.
 */
export const dynamic = 'force-dynamic';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </AuthProvider>
  );
}
