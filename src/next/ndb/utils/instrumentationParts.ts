/**
 * Utility functions for generating part names from score instrumentation.
 * Supports standard brass ensemble instrumentation and custom parts (e.g., choirs, flügelhorn).
 */

import { toInstrumentation } from './instrumentation';
import type { ScoreItem } from '../types';

/**
 * Generate numbered part names for an instrument.
 * If count is 1, returns singular name without number (e.g., "trp").
 * If count > 1, returns numbered names (e.g., ["trp1", "trp2"]).
 *
 * @param baseName - Base instrument name (e.g., "trp", "hrn")
 * @param count - Number of parts for this instrument
 * @returns Array of part names
 */
function generatePartNames(baseName: string, count: number): string[] {
  if (count === 0) return [];
  if (count === 1) return [baseName];
  return Array.from({ length: count }, (_, i) => `${baseName}${i + 1}`);
}

/**
 * Get all part names for a score based on its instrumentation or custom parts.
 *
 * Priority:
 * 1. If score has customParts defined → use those
 * 2. Otherwise → derive from instrumentation string + organ/percussion flags
 *
 * Standard instrumentation format (THTEU):
 * - Position 0: Trumpets (trp)
 * - Position 1: Horns (hrn)
 * - Position 2: Trombones (pos)
 * - Position 3: Euphoniums (eup)
 * - Position 4: Tubas (tub)
 * - Plus: org (if withOrgan), perc (if withPercussion)
 *
 * Custom parts (only in customParts):
 * - Flügelhorn (flg) - only appears in custom parts, not standard instrumentation
 * - Choirs, special groupings, etc.
 *
 * Naming rule: ALL instruments use same pattern:
 * - count = 1 → no number (e.g., "trp", "hrn", "flg")
 * - count > 1 → numbered (e.g., "trp1", "trp2", "flg1", "flg2")
 *
 * Examples:
 * - "41311" → ["trp1", "trp2", "trp3", "trp4", "hrn", "pos1", "pos2", "pos3", "eup", "tub"]
 * - "21101" + withOrgan → ["trp1", "trp2", "hrn", "pos", "tub", "org"]
 * - "10100" → ["trp", "hrn", "tub"]
 * - customParts: ["ch1_trp1", "ch1_flg1", "ch1_hrn", "ch2_trp1", "ch2_flg1", "ch2_hrn"]
 *
 * @param score - Score item with instrumentation or customParts
 * @returns Array of part names in order
 */
export function getPartsFromInstrumentation(score: Pick<ScoreItem, 'instrumentation' | 'withOrgan' | 'withPercussion' | 'customParts'>): string[] {
  // Priority 1: Use custom parts if defined
  if (score.customParts && score.customParts.length > 0) {
    return score.customParts;
  }

  // Priority 2: Derive from instrumentation
  const parts: string[] = [];

  // Parse instrumentation string (THTEU format)
  const inst = toInstrumentation(score.instrumentation || '00000');

  // Add parts for each instrument type
  parts.push(...generatePartNames('trp', inst.numTrumpets()));
  parts.push(...generatePartNames('hrn', inst.numHorns()));
  parts.push(...generatePartNames('pos', inst.numTrombones())); // pos = Posaune
  parts.push(...generatePartNames('eup', inst.numEuphoniums()));
  parts.push(...generatePartNames('tub', inst.numTubas()));

  // Add organ if present
  if (score.withOrgan) {
    parts.push('org');
  }

  // Add percussion if present
  if (score.withPercussion) {
    parts.push('perc');
  }

  return parts;
}
