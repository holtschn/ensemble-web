import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import { generateMeta } from '@/next/utils/generateMeta';

export default async function NotFoundPage() {
  return (
    <div className="flex flex-col middle-column items-center mt-32 align-middle">
      <h2 className="text-2xl font-bold my-8 text-center">404 – Seite nicht gefunden</h2>
      <Link className="text-sm text-center" href="/">
        Zurück zur Startseite
      </Link>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta();
}
