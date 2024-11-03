import { Page } from '@/payload-types';
import type { CollectionBeforeChangeHook } from 'payload';

export const populatePublishedDate: CollectionBeforeChangeHook<Page> = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    const now = new Date();
    return {
      ...data,
      publishedDate: now,
    };
  }
  return data;
};
