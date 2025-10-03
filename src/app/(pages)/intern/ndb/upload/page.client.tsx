'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now redirects to the unified create page
const ScoreUploadRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/intern/ndb/new');
  }, [router]);

  return null;
};

export default ScoreUploadRedirect;
