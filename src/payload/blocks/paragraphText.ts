import { Block } from 'payload';

export const ParagraphText: Block = {
  fields: [
    {
      name: 'text',
      label: 'Text',
      required: true,
      type: 'textarea',
    },
    {
      name: 'formatting',
      label: 'Formatierung',
      defaultValue: 'regular',
      options: [
        {
          label: 'normal',
          value: 'regular',
        },
        {
          label: 'fett',
          value: 'bold',
        },
      ],
      type: 'select',
    },
  ],
  slug: 'paragraphText',
  labels: { singular: 'Text', plural: 'Texte' },
};
