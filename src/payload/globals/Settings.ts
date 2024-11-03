import type { GlobalConfig } from 'payload';

import { loggedIn } from '@/payload/access/loggedIn';
import { publishedOr } from '@/payload/access/publishedOr';
import { admins } from '@/payload/access/admins';

export const Settings: GlobalConfig = {
  access: {
    read: publishedOr(loggedIn),
    update: admins,
  },
  fields: [
    {
      name: 'numberEventsHome',
      label: 'Anzahl Events auf der Homepage',
      type: 'number',
      min: 1,
      max: 10,
      defaultValue: 2,
    },
  ],
  slug: 'settings',
  typescript: {
    interface: 'Settings',
  },
};
