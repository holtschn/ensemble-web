import 'server-only';

import { getPayloadHMR } from '@/next/utils/payload';
import type { Settings } from '@/payload-types';

export async function getSettings(): Promise<Settings> {
  const payload = await getPayloadHMR();
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
