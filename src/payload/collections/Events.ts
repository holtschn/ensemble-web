import type { CollectionConfig } from 'payload';

import { slugField } from '@/payload/fields/slug';
import { createRevalidatePathHook } from '@/payload/hooks/revalidate';
import { populatePublishedDate } from '@/payload/hooks/populatePublishedDate';

import { publishedOr } from '@/payload/access/publishedOr';
import { admins } from '@/payload/access/admins';
import { loggedIn } from '@/payload/access/loggedIn';
import { createPreviewUrlProvider, eventPathProvider, eventUrlProvider } from '@/payload/utilities/slugs';
import { richText } from '@/payload/fields/richtext';

export const Events: CollectionConfig = {
  access: {
    create: loggedIn,
    delete: admins,
    read: publishedOr(loggedIn),
    update: loggedIn,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'eventDate', 'location'],
    livePreview: {
      url: eventUrlProvider,
    },
    preview: createPreviewUrlProvider(eventUrlProvider),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Titel der Veranstaltung',
      required: true,
      type: 'text',
    },
    {
      name: 'eventDate',
      label: 'Datum und Uhrzeit der Veranstaltung',
      required: true,
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'EEEE dd.MM.yyyy HH:mm',
          timeFormat: 'HH:mm',
          overrides: {
            locale: 'de-DE',
            timeZone: 'Europe/Berlin',
          },
        },
      },
    },
    {
      name: 'location',
      label: 'Ort der Veranstaltung',
      type: 'text',
    },
    {
      name: 'showOnHome',
      label: 'Auf der Startseite anzeigen',
      type: 'checkbox',
    },
    slugField(),
    {
      name: 'publishedDate',
      label: 'Veröffentlichungsdatum',
      type: 'date',
    },
    {
      name: 'publicDescription',
      label: 'Beschreibung der Veranstaltung (öffentlich, z.B. auf der Startseite)',
      type: 'textarea',
    },
    richText('internalDescription', 'Interne Beschreibung der Veranstaltung (nicht öffentlich)'),
  ],
  hooks: {
    afterChange: [createRevalidatePathHook(eventPathProvider)],
    beforeChange: [populatePublishedDate],
  },
  slug: 'events',
  versions: {
    drafts: true,
  },
};
