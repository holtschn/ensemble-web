import type { CollectionConfig } from 'payload';

import { admins } from '@/payload/access/admins';
import { loggedIn } from '@/payload/access/loggedIn';

export const Users: CollectionConfig = {
  access: {
    admin: admins,
    read: loggedIn,
    create: admins,
    update: loggedIn,
    delete: admins,
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
      access: {
        read: loggedIn,
        create: admins,
        update: admins,
      },
      type: 'text',
      required: true,
    },
    {
      name: 'instrument',
      label: 'Instrumente',
      access: {
        read: loggedIn,
        create: loggedIn,
        update: loggedIn,
      },
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Trumpet',
          value: 'trp',
        },
        {
          label: 'Horn',
          value: 'hrn',
        },
        {
          label: 'Trombone',
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
          label: 'Organ',
          value: 'org',
        },
        {
          label: 'Percussion',
          value: 'pcs',
        },
      ],
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
