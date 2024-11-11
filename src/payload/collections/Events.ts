import type { CollectionConfig } from 'payload';

import { slugField } from '@/payload/fields/slug';
import { populatePublishedDate } from '@/payload/hooks/populatePublishedDate';
import { createRevalidatePathHook } from '@/payload/hooks/revalidate';

import { admins } from '@/payload/access/admins';
import { loggedIn } from '@/payload/access/loggedIn';
import { publishedOr } from '@/payload/access/publishedOr';
import { richText } from '@/payload/fields/richtext';
import {
  createPreviewUrlProvider,
  eventPathProvider,
  eventUrlProvider,
  homePagePathProvider,
  internalHomePagePathProvider,
} from '@/payload/utilities/slugs';

export const Events: CollectionConfig = {
  access: {
    create: loggedIn,
    delete: admins,
    read: publishedOr(loggedIn),
    update: loggedIn,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'eventStart', 'eventEnd', 'concertLocation'],
    livePreview: {
      url: eventUrlProvider,
    },
    preview: createPreviewUrlProvider(eventUrlProvider),
    useAsTitle: 'title',
  },
  fields: [
    {
      tabs: [
        {
          label: 'Interne Informationen',
          description: 'In diesem Tab werden Eigenschaften gepflegt, die im internen Bereich angezeigt werden.',
          fields: [
            {
              name: 'title',
              label: '(Interner) Titel des Events',
              required: true,
              type: 'text',
            },
            {
              name: 'eventStart',
              label: 'Beginn des Events',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'default',
                  displayFormat: 'EEEE dd.MM.yyyy',
                  overrides: {
                    locale: 'de-DE',
                    timeZone: 'Europe/Berlin',
                  },
                },
              },
            },
            {
              name: 'eventEnd',
              label: 'Ende des Events',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'default',
                  displayFormat: 'EEEE dd.MM.yyyy',
                  overrides: {
                    locale: 'de-DE',
                    timeZone: 'Europe/Berlin',
                  },
                },
              },
            },
            richText('internalDescription', 'Interne Beschreibung der Veranstaltung (nicht öffentlich)'),
          ],
        },
        {
          label: 'Konzert-Informationen',
          description:
            'In diesem Tab werden Eigenschaften des Konzertes gepflegt, die z.B. auf der öffentlichen Homepage erscheinen.',
          fields: [
            {
              name: 'concertTitle',
              label: 'Titel des Konzerts',
              type: 'text',
            },
            {
              name: 'concertDate',
              label: 'Datum und Uhrzeit des Konzertes',
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
              name: 'concertLocation',
              label: 'Ort des Konzertes',
              type: 'text',
            },
            {
              name: 'concertDescription',
              label: 'Beschreibung des Konzertes (Werbetext)',
              type: 'textarea',
            },
            {
              name: 'showOnHome',
              label: 'Konzert auf der Startseite anzeigen',
              type: 'checkbox',
            },
          ],
        },
      ],
      type: 'tabs',
    },
    slugField(),
    {
      name: 'publishedDate',
      label: 'Veröffentlichungsdatum',
      type: 'date',
    },
  ],
  hooks: {
    afterChange: [createRevalidatePathHook([eventPathProvider, homePagePathProvider, internalHomePagePathProvider])],
    beforeChange: [populatePublishedDate],
  },
  slug: 'events',
  versions: {
    drafts: true,
  },
};
