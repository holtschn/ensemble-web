import type { PayloadRequest } from 'payload';

export const publishedOr = (
  crit: ({ req }: { req: PayloadRequest }) => boolean
): (({ req }: { req: PayloadRequest }) => boolean) => {
  return ({ req }: { req: PayloadRequest }) => {
    return crit({ req }) || req.data?._status === 'published';
  };
};
