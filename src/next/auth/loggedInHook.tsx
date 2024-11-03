'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/next/auth/context';

const useRedirectIfLoggedOut = () => {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loggedOut') {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);
};

export default useRedirectIfLoggedOut;
