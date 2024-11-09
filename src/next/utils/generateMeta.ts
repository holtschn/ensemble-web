import type { Metadata } from 'next';

import type { Settings } from '@/payload-types';

import { getSettings } from './settings';
import { PublicPage } from './pages';
import { SERVER_URL } from '@/next/utils/serverUrl';

const imageFromData = (data?: PublicPage | Settings) => {
  if (typeof data?.meta?.image === 'object' && data?.meta?.image !== null && 'url' in data?.meta?.image) {
    return [
      {
        url: `${SERVER_URL}${data.meta.image.url}`,
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

export const generateMeta = async (pageData?: PublicPage): Promise<Metadata> => {
  try {
    const settings = await getSettings();

    const title = oneOrOtherOrNull([pageData?.meta?.title, settings?.meta?.title]);
    const description = oneOrOtherOrNull([pageData?.meta?.description, settings?.meta?.description]);
    const ogImages = oneOrOtherOrNull([imageFromData(pageData), imageFromData(settings)]);

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
    title: '',
    description: '',
    openGraph: {
      title: '',
      description: '',
      images: [],
      url: '/',
    },
  };
};
