import 'server-only';

import config from '@payload-config';

import { getPayloadHMR as internalGetPayloadHMR } from '@payloadcms/next/utilities';
import { BasePayload } from 'payload';

let payload: BasePayload | null = null;

export const getPayloadHMR = async () => {
  if (payload) {
    return payload;
  }
  payload = await internalGetPayloadHMR({ config });
  return payload;
};
