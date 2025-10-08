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
      name: 'theme',
      label: 'Design',
      type: 'group',
      fields: [
        {
          name: 'fontFamily',
          label: 'Schriftart',
          defaultValue: 'lexend',
          options: [
            {
              label: 'Lexend',
              value: 'lexend',
            },
            {
              label: 'Lekton',
              value: 'lekton',
            },
          ],
          type: 'select',
        },
        {
          name: 'highlightColor',
          label: 'Akzentfarbe (Hex)',
          type: 'text',
          defaultValue: '#10b981',
          admin: {
            description: 'Hauptfarbe für Buttons, Links und Hervorhebungen (z.B. #10b981 für Grün)',
            placeholder: '#10b981',
          },
          validate: (val: any) => {
            if (!val || typeof val !== 'string') return true; // Optional field
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Bitte gültigen Hex-Farbcode eingeben (z.B. #10b981)';
            }
            return true;
          },
        },
      ],
    },
    {
      name: 'homepageHero',
      label: 'Großes Bild auf der Homepage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'homepageLogo',
      label: 'Logo über dem Bild auf der Homepage',
      type: 'upload',
      relationTo: 'media',
    },
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
