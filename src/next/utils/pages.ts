import { getPayloadHMR } from '@payloadcms/next/utilities';

import config from '@payload-config';
import { Page } from '@/payload-types';

export type PublicPage = Pick<Page, 'title' | 'content' | 'slug' | 'meta'>;

export function sanitizePage(page: Page): PublicPage {
  return {
    title: page.title,
    content: page.content,
    slug: page.slug,
    meta: page.meta,
  };
}

export async function getPublicPage(slug: string, isDraftMode: boolean): Promise<PublicPage | null> {
  const payload = await getPayloadHMR({ config });
  const data = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
    },
    draft: isDraftMode,
  });
  if (data?.docs && data.docs.length > 0) {
    return sanitizePage(data.docs[0]);
  }
  return null;
}

export async function getAllPublicPages(isDraftMode: boolean, limit: number = 1000): Promise<PublicPage[]> {
  const payload = await getPayloadHMR({ config });
  return payload
    .find({
      collection: 'pages',
      where: {
        _status: { equals: 'published' },
      },
      limit: limit,
      draft: isDraftMode,
    })
    .then((data) => data.docs.map(sanitizePage));
}
