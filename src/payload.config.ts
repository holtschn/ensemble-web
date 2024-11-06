import path from 'path';
import { fileURLToPath } from 'url';

import { buildConfig } from 'payload';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';

import { createTransport } from 'nodemailer';

import { Users } from './payload/collections/Users';
import { Media } from './payload/collections/Media';
import { Pages } from './payload/collections/Pages';
import { Events } from './payload/collections/Events';

import { Settings } from './payload/globals/Settings';
import { Header } from './payload/globals/Header';
import { Footer } from './payload/globals/Footer';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const mailTransport = createTransport({
  host: process.env.NODEMAILER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'light',
    components: {
      graphics: {
        Logo: './payload/components/logo',
        Icon: './payload/components/icon',
      },
      beforeNavLinks: ['./payload/components/adminLinks'],
    },
    avatar: undefined,
  },
  globals: [Settings, Header, Footer],
  collections: [Users, Media, Pages, Events],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'schema.graphql'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL!,
    },
  }),
  email: nodemailerAdapter({
    transport: mailTransport,
    defaultFromAddress: 'admin@blechcontakt.de',
    defaultFromName: 'BlechConTakt Admin',
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
    // s3Storage({
    //   collections: {
    //     media: true
    //   },
    //   bucket: process.env.S3_BUCKET!,
    //   config: {
    //     credentials: {
    //       accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    //       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    //     },
    //     region: process.env.S3_REGION!
    //   },
    // }),
    seoPlugin({
      collections: ['pages'],
      globals: ['settings'],
      uploadsCollection: 'media',
      tabbedUI: true,
    }),
  ],
});
