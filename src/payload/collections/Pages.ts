import type { CollectionConfig } from 'payload';

import { slugField } from '@/payload/fields/slug';
import { createRevalidatePathHook } from '@/payload/hooks/revalidate';
import { populatePublishedDate } from '@/payload/hooks/populatePublishedDate';

import { publishedOr } from '@/payload/access/publishedOr';
import { admins } from '@/payload/access/admins';
import { loggedIn } from '@/payload/access/loggedIn';
import { createPreviewUrlProvider, pagePathProvider, pageUrlProvider } from '@/payload/utilities/slugs';
import { ImageText } from '@/payload/blocks/imageText';
import { ParagraphText } from '@/payload/blocks/paragraphText';
import { HeadingText } from '@/payload/blocks/headingText';
import { PlayerProfile } from '@/payload/blocks/playerProfile';

export const Pages: CollectionConfig = {
  access: {
    create: admins,
    delete: admins,
    read: publishedOr(loggedIn),
    update: loggedIn,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: pageUrlProvider,
    },
    preview: createPreviewUrlProvider(pageUrlProvider),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Titel der Seite',
      required: true,
      type: 'text',
    },
    {
      name: 'content',
      label: 'Inhalt der Seite',
      blocks: [ParagraphText, ImageText, HeadingText, PlayerProfile],
      required: true,
      type: 'blocks',
    },
    {
      name: 'navigationLabel',
      label: 'Anzeigetext z.B. in der Navigation oder im Footer',
      required: true,
      type: 'text',
    },
    slugField(),
    {
      name: 'publishedDate',
      label: 'Veröffentlichungsdatum',
      type: 'date',
    },
  ],
  hooks: {
    afterChange: [createRevalidatePathHook([pagePathProvider])],
    beforeChange: [populatePublishedDate],
  },
  slug: 'pages',
  versions: {
    drafts: true,
  },
};
