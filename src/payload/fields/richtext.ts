import { Field } from 'payload';
import {
  lexicalEditor,
  FixedToolbarFeature,
  HTMLConverterFeature,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical';

type RichText = (name: string, label: string) => Field;

export const richText: RichText = (name, label) => ({
  name: name,
  label: label,
  admin: {},
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
      FixedToolbarFeature(),
      HTMLConverterFeature({}),
    ],
  }),
  index: false,
  required: false,
  type: 'richText',
});
