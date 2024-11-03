import type { PayloadRequest } from 'payload';

import { checkUserRole } from './checkUserRole';

export const loggedIn = ({ req }: { req: PayloadRequest }): boolean => {
  return checkUserRole(['user', 'admin'], req.user ?? undefined);
};
