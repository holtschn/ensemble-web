import React from 'react';
import Link from 'next/link';
import Icon from '@/next/ndb/components/Icon';

const BackToSetlists = () => {
  return (
    <Link href="/intern/ndb/setlists" className="flex items-center ndb-profex-label">
      <Icon name="arrow-left" alt="Back to list" className="mr-2 h-3 w-3" />
      <div className="mt-0.5">Zurück zu Setlists</div>
    </Link>
  );
};

export default BackToSetlists;
