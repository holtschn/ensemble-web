import type { CollectionConfig } from 'payload';
import { anyone } from '@/payload/access/anyone';
import { loggedIn } from '@/payload/access/loggedIn';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: loggedIn,
    delete: loggedIn,
    read: anyone,
    update: loggedIn,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
};
