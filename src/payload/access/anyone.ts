import type { PayloadRequest } from 'payload';

export const anyone = ({ req }: { req: PayloadRequest }): boolean => {
  return true;
};
