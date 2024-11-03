import { Block } from 'payload';

export const PlayerProfile: Block = {
  fields: [
    {
      name: 'name',
      label: 'Name',
      required: true,
      type: 'text',
    },
    {
      name: 'instruments',
      label: 'Instrumente',
      required: true,
      type: 'text',
    },
    {
      name: 'image',
      label: 'Profilbild',
      required: false,
      type: 'upload',
      relationTo: 'media',
    },
  ],
  slug: 'playerProfile',
  labels: { singular: 'Spieler', plural: 'Spieler' },
};
