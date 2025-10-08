import 'server-only';

import { getPayload } from 'payload';

import type { Settings } from '@/payload-types';
import config from '@payload-config';

export async function getSettings(): Promise<Settings> {
  const payload = await getPayload({ config });

  try {
    const data = await payload.findGlobal({ slug: 'settings' });
    // Ensure theme defaults
    return {
      ...data,
      theme: {
        fontFamily: data.theme?.fontFamily || 'lexend',
        highlightColor: data.theme?.highlightColor || '#10b981',
      },
    };
  } catch (error) {
    console.log('could not get global settings data', error);
  }
  return {
    id: -1,
    numberEventsHome: 2,
    theme: {
      fontFamily: 'lexend',
      highlightColor: '#10b981',
    },
  };
}
