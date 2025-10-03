import React from 'react';
import { ScoresPageClient } from './page.client';

export default function ScoresPage() {
  return <ScoresPageClient />;
}

export const metadata = {
  title: 'Notendatenbank',
  description: 'Übersicht unserer Sammlung von Blechbläser-Noten',
};
