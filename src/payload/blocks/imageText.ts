import { Block } from 'payload';

export const ImageText: Block = {
  fields: [
    {
      name: 'image',
      label: 'Bild',
      required: true,
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'text',
      label: 'Text',
      required: true,
      type: 'textarea',
    },
  ],
  slug: 'imageText',
  labels: { singular: 'Absatz mit Bild', plural: 'Absatz mit Bildern' },
};
