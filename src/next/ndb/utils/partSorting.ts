/**
 * Utility for sorting instrument parts in the correct brass ensemble order.
 */

/**
 * Standard brass ensemble instrument order.
 * Used to sort parts for display in tables and grids.
 */
const INSTRUMENT_ORDER = ['trp', 'flg', 'hrn', 'pos', 'eup', 'tub', 'org', 'perc'] as const;

/**
 * Extract the base instrument from a part name for sorting purposes.
 *
 * Examples:
 * - 'trp1' → 'trp'
 * - 'ch1_flg2' → 'flg'
 * - 'solo_hrn' → 'hrn'
 *
 * @param part - Part name (e.g., 'trp1', 'ch1_flg1')
 * @returns Base instrument code or the original part if not recognized
 */
function getBaseInstrumentForSorting(part: string): string {
  // Try each known instrument in order
  for (const instrument of INSTRUMENT_ORDER) {
    // Check if part contains this instrument
    // Match either at end, before number, or as whole segment
    const patterns = [
      new RegExp(`${instrument}\\d*$`), // Ends with instrument + optional number
      new RegExp(`_${instrument}\\d*$`), // After underscore
      new RegExp(`^${instrument}\\d*$`), // Whole string
    ];

    if (patterns.some(pattern => pattern.test(part))) {
      return instrument;
    }
  }

  return part; // Unknown instrument, return as-is
}

/**
 * Get the numeric suffix from a part name for sorting.
 *
 * Examples:
 * - 'trp1' → 1
 * - 'trp12' → 12
 * - 'trp' → 0
 * - 'ch1_trp2' → 2
 *
 * @param part - Part name
 * @returns Numeric suffix or 0 if no number
 */
function getPartNumber(part: string): number {
  const match = part.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Sort parts in standard brass ensemble order.
 *
 * Order:
 * 1. Trumpets (trp1, trp2, ...)
 * 2. Flügelhorns (flg1, flg2, ...)
 * 3. Horns (hrn1, hrn2, ...)
 * 4. Trombones (pos1, pos2, ...)
 * 5. Euphoniums (eup1, eup2, ...)
 * 6. Tubas (tub1, tub2, ...)
 * 7. Organ (org)
 * 8. Percussion (perc)
 *
 * Within each instrument group, parts are sorted numerically.
 * Custom parts (with prefixes) are sorted by their base instrument.
 *
 * @param parts - Array of part names to sort
 * @returns Sorted array of part names
 */
export function sortParts(parts: string[]): string[] {
  return [...parts].sort((a, b) => {
    const baseA = getBaseInstrumentForSorting(a);
    const baseB = getBaseInstrumentForSorting(b);

    // Get instrument order indices
    const orderA = INSTRUMENT_ORDER.indexOf(baseA as typeof INSTRUMENT_ORDER[number]);
    const orderB = INSTRUMENT_ORDER.indexOf(baseB as typeof INSTRUMENT_ORDER[number]);

    // If both instruments are known, compare by order
    if (orderA !== -1 && orderB !== -1) {
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Same instrument, compare by number
      return getPartNumber(a) - getPartNumber(b);
    }

    // If one is known and other isn't, known comes first
    if (orderA !== -1) return -1;
    if (orderB !== -1) return 1;

    // Both unknown, alphabetical sort
    return a.localeCompare(b);
  });
}

/**
 * Merge singular and plural-1 columns to save space.
 *
 * If both "X" and "X1" exist in the parts list (e.g., "hrn" and "hrn1"),
 * removes the singular "X" and keeps "X1" as the canonical column.
 *
 * This reduces column count when setlist has scores with different part counts.
 * Example: If one score needs "hrn" and another needs "hrn1, hrn2",
 * we merge "hrn" into "hrn1" column instead of showing both.
 *
 * @param parts - Array of part names
 * @returns Array with merged parts (singular removed where X1 exists)
 */
export function mergePartsColumns(parts: string[]): string[] {
  const partsSet = new Set(parts);
  const result: string[] = [];

  for (const part of parts) {
    // Check if this is a singular part (no number at end)
    if (!/\d$/.test(part)) {
      // Check if we also have the "1" version (e.g., "hrn" → "hrn1")
      const plural1Version = `${part}1`;
      if (partsSet.has(plural1Version)) {
        // Skip this singular part, we'll use the plural-1 version instead
        continue;
      }
    }

    result.push(part);
  }

  return result;
}
