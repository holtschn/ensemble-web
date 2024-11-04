import type { Metadata } from 'next';

import type { Page, Settings } from '@/payload-types';

import { getSettings } from './settings';

export const DEFAULT_PAGE_TITLE = 'R(h)einblech Quintett';
export const DEFAULT_PAGE_DESCRIPTION =
  'Das R(h)einblech Quintett präsentiert sich und seine nächsten Konzerte der staunenden Weltöffentlichkeit.';
export const DEFAULT_OG_IMAGES = [
  {
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/og_image.jpg`,
  },
];

const imageFromData = (data?: Page | Settings) => {
  if (typeof data?.meta?.image === 'object' && data?.meta?.image !== null && 'url' in data?.meta?.image) {
    return [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}${data.meta.image.url}`,
      },
    ];
  }
  return null;
};

type T = any;
const oneOrOtherOrNull = (values: T[]): T | null => {
  for (const value of values) {
    if (value) {
      return value;
    }
  }
  return null;
};

export const generateMeta = async (pageData?: Page): Promise<Metadata> => {
  try {
    const settings = await getSettings();

    const title = oneOrOtherOrNull([pageData?.meta?.title, settings?.meta?.title, DEFAULT_PAGE_TITLE]);
    const description = oneOrOtherOrNull([
      pageData?.meta?.description,
      settings?.meta?.description,
      DEFAULT_PAGE_DESCRIPTION,
    ]);
    const ogImages = oneOrOtherOrNull([imageFromData(pageData), imageFromData(settings), DEFAULT_OG_IMAGES]);

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: ogImages ? ogImages : undefined,
        url: pageData?.slug ? `/${pageData?.slug}` : '/',
      },
    };
  } catch (error) {
    console.log('Could not generate Metadata', error);
  }
  return {
    title: DEFAULT_PAGE_TITLE,
    description: DEFAULT_PAGE_DESCRIPTION,
    openGraph: {
      title: DEFAULT_PAGE_TITLE,
      description: DEFAULT_PAGE_DESCRIPTION,
      images: DEFAULT_OG_IMAGES,
      url: '/',
    },
  };
};
