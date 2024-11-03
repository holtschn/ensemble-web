import type { Field } from 'payload';

import { formatSlug } from '@/payload/utilities/slugs';

type Slug = (fieldToUse?: string) => Field;

export const slugField: Slug = (fieldToUse = 'title') => ({
  name: 'slug',
  label: 'Slug - Pfad in der URL',
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
  index: true,
  required: true,
  type: 'text',
});
