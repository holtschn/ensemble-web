import { Block } from 'payload';

export const PlayersList: Block = {
  fields: [
    {
      name: 'heading',
      label: 'Überschrift',
      required: true,
      type: 'text',
    },
    {
      name: 'players',
      label: 'Liste der angezeigten Spieler',
      required: true,
      relationTo: 'users',
      hasMany: true,
      type: 'relationship',
    },
  ],
  slug: 'playersList',
  labels: { singular: 'Liste der Spieler', plural: 'Listen der Spieler' },
};
