import type { PayloadRequest } from 'payload';

import { checkUserRole } from './checkUserRole';

export const admins = ({ req }: { req: PayloadRequest }): boolean => {
  return checkUserRole(['admin'], req.user ?? undefined);
};
