import type { CollectionConfig } from 'payload';

import { admins } from '@/payload/access/admins';
import { loggedIn } from '@/payload/access/loggedIn';
import { publishedOr } from '@/payload/access/publishedOr';

export const Users: CollectionConfig = {
  access: {
    admin: loggedIn,
    read: publishedOr(loggedIn),
    create: admins,
    update: loggedIn,
    delete: admins,
    unlock: admins,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: 'Vor- und Nachname',
      type: 'text',
      required: true,
      access: {
        read: publishedOr(loggedIn),
        create: admins,
        update: loggedIn,
      },
    },
    {
      name: 'phone',
      label: 'Telefonnummer',
      type: 'text',
      access: {
        read: loggedIn,
        create: admins,
        update: loggedIn,
      },
    },
    {
      name: 'street',
      label: 'Straße und Hausnummer',
      type: 'text',
      access: {
        read: loggedIn,
        create: admins,
        update: loggedIn,
      },
    },
    {
      name: 'location',
      label: 'Postleitzahl und Ort',
      type: 'text',
      access: {
        read: loggedIn,
        create: admins,
        update: loggedIn,
      },
    },
    {
      name: 'instruments',
      label: 'Instrumente',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Trompete',
          value: 'trp',
        },
        {
          label: 'Flügelhorn',
          value: 'flg',
        },
        {
          label: 'Horn',
          value: 'hrn',
        },
        {
          label: 'Posaune',
          value: 'trb',
        },
        {
          label: 'Euphonium',
          value: 'eup',
        },
        {
          label: 'Tuba',
          value: 'tub',
        },
        {
          label: 'Orgel',
          value: 'org',
        },
        {
          label: 'Schlagwerk',
          value: 'pcs',
        },
        {
          label: 'Dirigat',
          value: 'dir',
        },
      ],
      access: {
        read: publishedOr(loggedIn),
        create: admins,
        update: loggedIn,
      },
    },
    {
      name: 'image',
      label: 'Bild',
      type: 'upload',
      relationTo: 'media',
      access: {
        read: publishedOr(loggedIn),
        create: admins,
        update: loggedIn,
      },
    },
    {
      name: 'roles',
      label: 'Zugriffsrechte',
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
    },
  ],
  slug: 'users',
  timestamps: true,
};
