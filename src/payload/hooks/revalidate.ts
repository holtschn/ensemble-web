import type { CollectionAfterChangeHook, Payload } from 'payload';

import { Page } from '@/payload-types';
import { SERVER_URL } from '@/next/utils/serverUrl';

export const createRevalidatePathHook = (
  pathProviders: ((data: Record<string, any>) => string)[]
): CollectionAfterChangeHook<any> => {
  const revalidatePage: CollectionAfterChangeHook<Page> = ({ doc, req }) => {
    for (const pathProvider of pathProviders) {
      revalidate({ path: pathProvider(doc), payloadClient: req.payload });
    }
    return doc;
  };
  return revalidatePage;
};

type RevalidateArgs = {
  path?: string | null;
  payloadClient: Payload;
};

export const revalidate = async (args: RevalidateArgs): Promise<void> => {
  const { path, payloadClient } = args;
  try {
    const res = await fetch(`${SERVER_URL}/api/revalidate?secret=${process.env.NEXT_REVALIDATION_KEY}&path=${path}`);
    if (res.ok) {
      payloadClient.logger.info(`Revalidated path '${path}'`);
    } else {
      payloadClient.logger.error({ res }, `Error revalidating path '${path}'`);
    }
  } catch (err: unknown) {
    payloadClient.logger.error({ err }, `Error hitting revalidate route for path '${path}'`);
  }
};
