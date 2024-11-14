import 'server-only';

import { getPayloadHMR } from '@payloadcms/next/utilities';

import config from '@payload-config';
import { User } from '@/payload-types';
import { toInstrumentsString } from '@/next/utils/strings';

export type PublicUser = Pick<User, 'name' | 'instruments'> & {
  instrumentsString: string;
};

export type EnrichedUser = User & {
  instrumentsString: string;
};

export function sanitizeUser(user: User | null): EnrichedUser | null {
  if (!user) {
    return null;
  }
  const instrumentsString = toInstrumentsString(user.instruments);
  return {
    id: user.id,
    name: user.name,
    phone: null,
    street: null,
    location: null,
    instruments: user.instruments,
    image: user.image,
    roles: null,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
    email: '',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
    instrumentsString,
  };
}

export function enrichUser(user: User): EnrichedUser {
  const instrumentsString = toInstrumentsString(user.instruments);
  return {
    ...user,
    instrumentsString,
  };
}

export async function getAllEnrichedUsers(isDraftMode: boolean, limit: number = 1000): Promise<EnrichedUser[]> {
  const payload = await getPayloadHMR({ config });
  const data = await payload.find({
    collection: 'users',
    sort: 'name',
    limit: limit,
    draft: isDraftMode,
  });
  if (data?.docs && data.docs.length > 0) {
    return data.docs.map(enrichUser);
  }
  return [];
}
