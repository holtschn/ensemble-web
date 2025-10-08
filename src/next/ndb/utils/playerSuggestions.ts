/**
 * Utility functions for suggesting players based on instrument parts.
 * Maps part names to user instruments and provides player name suggestions.
 */

import type { EnrichedUser } from '@/next/utils/users';

/**
 * Instrument type as defined in Payload User collection.
 * Must match the exact values from payload-types.ts
 */
type UserInstrument = 'trp' | 'flg' | 'hrn' | 'trb' | 'eup' | 'tub' | 'org' | 'pcs' | 'dir';

/**
 * Maps part names to user instrument values.
 *
 * Special mappings:
 * - 'pos' (Posaune) → 'trb' (Trombone)
 * - 'perc' (Percussion) → 'pcs' (Schlagwerk)
 */
const PART_TO_INSTRUMENT_MAP: Record<string, UserInstrument> = {
  trp: 'trp',
  flg: 'flg',
  hrn: 'hrn',
  pos: 'trb', // Posaune → Trombone
  eup: 'eup',
  tub: 'tub',
  org: 'org',
  perc: 'pcs', // Percussion → Schlagwerk
  dir: 'dir', // Director
};

/**
 * Extracts the base instrument from a part name.
 *
 * Examples:
 * - 'trp1' → 'trp'
 * - 'trp' → 'trp'
 * - 'ch1_trp1' → 'trp'
 * - 'solo_flg' → 'flg'
 * - 'choir_1_hrn2' → 'hrn'
 *
 * @param part - Part name (e.g., 'trp1', 'ch1_trp1', 'pos2')
 * @returns Base instrument code or null if not recognized
 */
export function extractBaseInstrument(part: string): string | null {
  // Remove numbers from the end
  const withoutNumbers = part.replace(/\d+$/, '');

  // Try direct lookup first (e.g., 'trp' → 'trp')
  if (withoutNumbers in PART_TO_INSTRUMENT_MAP) {
    return withoutNumbers;
  }

  // Handle custom parts with prefixes/underscores (e.g., 'ch1_trp', 'solo_flg')
  // Extract the last segment after underscore that matches a known instrument
  const segments = withoutNumbers.split('_');
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    if (segment in PART_TO_INSTRUMENT_MAP) {
      return segment;
    }
  }

  return null;
}

/**
 * Maps a part name to the corresponding user instrument value.
 *
 * @param part - Part name (e.g., 'trp1', 'pos2', 'ch1_flg1')
 * @returns User instrument value or null if not recognized
 */
export function mapPartToInstrument(part: string): UserInstrument | null {
  const baseInstrument = extractBaseInstrument(part);

  if (!baseInstrument) {
    return null;
  }

  return PART_TO_INSTRUMENT_MAP[baseInstrument] || null;
}

/**
 * Extract first name from a full name.
 *
 * @param fullName - Full name (e.g., "Alice Müller", "Bob")
 * @returns First name only (e.g., "Alice", "Bob")
 */
function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}

/**
 * Get suggested player names for a specific part based on user instruments.
 *
 * Filters users who play the instrument corresponding to the part,
 * then returns their first names only, sorted alphabetically.
 *
 * @param part - Part name (e.g., 'trp1', 'pos2', 'ch1_flg1')
 * @param users - Array of enriched users
 * @returns Array of player first names sorted alphabetically
 */
export function getSuggestedPlayersForPart(part: string, users: EnrichedUser[]): string[] {
  const targetInstrument = mapPartToInstrument(part);

  if (!targetInstrument) {
    return [];
  }

  // Filter users who play this instrument
  const matchingUsers = users.filter((user) => {
    // Check if user has instruments array and it includes the target instrument
    return user.instruments && user.instruments.includes(targetInstrument);
  });

  // Extract first names and sort alphabetically
  const playerNames = matchingUsers
    .map((user) => user.name)
    .filter((name): name is string => !!name) // Remove null/undefined names
    .map(getFirstName) // Extract first name only
    .sort((a, b) => a.localeCompare(b, 'de')); // German locale sort

  return playerNames;
}
