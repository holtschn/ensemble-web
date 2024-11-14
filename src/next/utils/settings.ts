import 'server-only';

import type { Settings } from '@/payload-types';

import config from '@payload-config';
import { getPayloadHMR } from '@payloadcms/next/utilities';

export async function getSettings(): Promise<Settings> {
  const payload = await getPayloadHMR({ config });
  try {
    const data = await payload.findGlobal({ slug: 'settings' });
    return data;
  } catch (error) {
    console.log('could not get global settings data', error);
  }
  return {
    id: -1,
    numberEventsHome: 2,
  };
}
