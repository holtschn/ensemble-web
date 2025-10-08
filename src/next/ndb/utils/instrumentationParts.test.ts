/**
 * Tests for instrumentationParts utility functions
 */

import { getPartsFromInstrumentation } from './instrumentationParts';

describe('getPartsFromInstrumentation', () => {
  describe('Standard instrumentation (from THTEU string)', () => {
    it('should generate parts for 41311 (standard brass ensemble)', () => {
      const score = {
        instrumentation: '41311',
        withOrgan: false,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([
        'trp1', 'trp2', 'trp3', 'trp4', // 4 trumpets
        'hrn', // 1 horn (singular)
        'pos1', 'pos2', 'pos3', // 3 trombones
        'eup', // 1 euphonium (singular)
        'tub', // 1 tuba (singular)
      ]);
    });

    it('should generate parts for 21101 (smaller ensemble)', () => {
      const score = {
        instrumentation: '21101',
        withOrgan: false,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([
        'trp1', 'trp2', // 2 trumpets
        'hrn', // 1 horn
        'pos', // 1 trombone (singular)
        'tub', // 1 tuba
      ]);
    });

    it('should generate parts for 11001 (quintet - all singular)', () => {
      const score = {
        instrumentation: '11001',
        withOrgan: false,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['trp', 'hrn', 'tub']);
    });

    it('should handle large ensemble with many instruments', () => {
      const score = {
        instrumentation: '84824',
        withOrgan: false,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([
        'trp1', 'trp2', 'trp3', 'trp4', 'trp5', 'trp6', 'trp7', 'trp8',
        'hrn1', 'hrn2', 'hrn3', 'hrn4',
        'pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6', 'pos7', 'pos8',
        'eup1', 'eup2',
        'tub1', 'tub2', 'tub3', 'tub4',
      ]);
    });
  });

  describe('With organ and percussion', () => {
    it('should add organ when withOrgan is true', () => {
      const score = {
        instrumentation: '21101',
        withOrgan: true,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([
        'trp1', 'trp2',
        'hrn',
        'pos',
        'tub',
        'org', // Organ added
      ]);
    });

    it('should add percussion when withPercussion is true', () => {
      const score = {
        instrumentation: '41311',
        withOrgan: false,
        withPercussion: true,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toContain('perc');
      expect(parts[parts.length - 1]).toBe('perc'); // Should be last
    });

    it('should add both organ and percussion when both are true', () => {
      const score = {
        instrumentation: '21101',
        withOrgan: true,
        withPercussion: true,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([
        'trp1', 'trp2',
        'hrn',
        'pos',
        'tub',
        'org',
        'perc',
      ]);
    });
  });

  describe('Custom parts (with flügelhorn support)', () => {
    it('should use customParts when provided', () => {
      const score = {
        instrumentation: '42401',
        withOrgan: false,
        withPercussion: false,
        customParts: ['ch1_trp1', 'ch1_flg1', 'ch1_hrn', 'ch2_trp1', 'ch2_flg1', 'ch2_hrn'],
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['ch1_trp1', 'ch1_flg1', 'ch1_hrn', 'ch2_trp1', 'ch2_flg1', 'ch2_hrn']);
    });

    it('should use customParts even if instrumentation suggests different parts', () => {
      const score = {
        instrumentation: '00000', // Empty instrumentation
        withOrgan: true,
        withPercussion: true,
        customParts: ['flg', 'trp1', 'trp2'],
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['flg', 'trp1', 'trp2']);
      expect(parts).not.toContain('org'); // Ignores withOrgan when customParts present
      expect(parts).not.toContain('perc'); // Ignores withPercussion when customParts present
    });

    it('should handle single flügelhorn in customParts', () => {
      const score = {
        instrumentation: '11001',
        withOrgan: false,
        withPercussion: false,
        customParts: ['flg', 'trp', 'hrn'],
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toContain('flg');
      expect(parts.length).toBe(3);
    });

    it('should handle multiple flügelhörner in customParts', () => {
      const score = {
        instrumentation: '20200',
        withOrgan: false,
        withPercussion: false,
        customParts: ['flg1', 'flg2', 'trp1', 'trp2'],
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['flg1', 'flg2', 'trp1', 'trp2']);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty instrumentation string', () => {
      const score = {
        instrumentation: '',
        withOrgan: false,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([]);
    });

    it('should handle zero counts for all instruments', () => {
      const score = {
        instrumentation: '00000',
        withOrgan: false,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual([]);
    });

    it('should handle only organ without any brass', () => {
      const score = {
        instrumentation: '00000',
        withOrgan: true,
        withPercussion: false,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['org']);
    });

    it('should handle empty customParts array (fallback to instrumentation)', () => {
      const score = {
        instrumentation: '11001',
        withOrgan: false,
        withPercussion: false,
        customParts: [],
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['trp', 'hrn', 'tub']);
    });

    it('should handle null customParts (fallback to instrumentation)', () => {
      const score = {
        instrumentation: '11001',
        withOrgan: false,
        withPercussion: false,
        customParts: null,
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['trp', 'hrn', 'tub']);
    });

    it('should handle customParts with special characters and underscores', () => {
      const score = {
        instrumentation: '00000',
        withOrgan: false,
        withPercussion: false,
        customParts: ['solo_trp', 'choir_1_trp1', 'choir_1_trp2', 'choir_2_flg'],
      };

      const parts = getPartsFromInstrumentation(score);

      expect(parts).toEqual(['solo_trp', 'choir_1_trp1', 'choir_1_trp2', 'choir_2_flg']);
    });
  });
});
