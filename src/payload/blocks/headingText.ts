import { Block } from 'payload';

export const HeadingText: Block = {
  fields: [
    {
      name: 'htmlTag',
      label: 'Typ der Überschrift',
      defaultValue: 'h2',
      options: [
        {
          label: 'Sub-Heading',
          value: 'h2',
        },
        {
          label: 'Sub-Sub-Heading3',
          value: 'h3',
        },
      ],
      type: 'select',
    },
    {
      name: 'text',
      label: 'Text',
      required: true,
      type: 'text',
    },
    {
      name: 'alignLeft',
      label: 'Links ausrichten',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  slug: 'headingText',
  labels: { singular: 'Überschrift', plural: 'Überschriften' },
};
