/**
 * Server actions for user-related operations
 * These can be called from client components
 */

'use server';

import { getAllEnrichedUsers } from '@/next/utils/users';
import type { EnrichedUser } from '@/next/utils/users';

/**
 * Fetch all enriched users (server action)
 * Can be called from client components
 */
export async function fetchEnrichedUsers(): Promise<EnrichedUser[]> {
  try {
    return await getAllEnrichedUsers(false);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
