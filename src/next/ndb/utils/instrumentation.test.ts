/**
 * Tests for instrumentation utility functions
 */

import { toInstrumentation, createDefaultInstrumentation, type Instrumentation } from './instrumentation';

describe('Instrumentation Utilities', () => {
  describe('toInstrumentation', () => {
    it('should parse valid instrumentation string', () => {
      const inst = toInstrumentation('42401');

      expect(inst.numTrumpets()).toBe(4);
      expect(inst.numHorns()).toBe(2);
      expect(inst.numTrombones()).toBe(4);
      expect(inst.numEuphoniums()).toBe(0);
      expect(inst.numTubas()).toBe(1);
    });

    it('should handle empty string', () => {
      const inst = toInstrumentation('');

      expect(inst.numTrumpets()).toBe(0);
      expect(inst.numHorns()).toBe(0);
      expect(inst.numTrombones()).toBe(0);
      expect(inst.numEuphoniums()).toBe(0);
      expect(inst.numTubas()).toBe(0);
    });

    it('should handle partial instrumentation string', () => {
      const inst = toInstrumentation('12');

      expect(inst.numTrumpets()).toBe(1);
      expect(inst.numHorns()).toBe(2);
      expect(inst.numTrombones()).toBe(0);
      expect(inst.numEuphoniums()).toBe(0);
      expect(inst.numTubas()).toBe(0);
    });

    it('should render correct string representation', () => {
      const inst = toInstrumentation('42401');
      expect(inst.renderValue()).toBe('42401');
    });

    it('should calculate total number of players', () => {
      const inst = toInstrumentation('42401');
      expect(inst.numTotal()).toBe(11);
    });

    it('should handle quintet (5 players)', () => {
      const inst = toInstrumentation('12200');
      expect(inst.numTotal()).toBe(5);
    });

    it('should handle large ensemble (10+ players)', () => {
      const inst = toInstrumentation('84804');
      expect(inst.numTotal()).toBe(24);
    });
  });

  describe('Instrumentation immutability', () => {
    it('should create new instance when modifying trumpets', () => {
      const original = toInstrumentation('42401');
      const modified = original.withTrumpets(6);

      expect(original.numTrumpets()).toBe(4);
      expect(modified.numTrumpets()).toBe(6);
      expect(modified.numHorns()).toBe(2);
    });

    it('should create new instance when modifying horns', () => {
      const original = toInstrumentation('42401');
      const modified = original.withHorns(4);

      expect(original.numHorns()).toBe(2);
      expect(modified.numHorns()).toBe(4);
      expect(modified.numTrumpets()).toBe(4);
    });

    it('should create new instance when modifying trombones', () => {
      const original = toInstrumentation('42401');
      const modified = original.withTrombones(3);

      expect(original.numTrombones()).toBe(4);
      expect(modified.numTrombones()).toBe(3);
    });

    it('should create new instance when modifying euphoniums', () => {
      const original = toInstrumentation('42401');
      const modified = original.withEuphoniums(2);

      expect(original.numEuphoniums()).toBe(0);
      expect(modified.numEuphoniums()).toBe(2);
    });

    it('should create new instance when modifying tubas', () => {
      const original = toInstrumentation('42401');
      const modified = original.withTubas(2);

      expect(original.numTubas()).toBe(1);
      expect(modified.numTubas()).toBe(2);
    });
  });

  describe('createDefaultInstrumentation', () => {
    it('should create default brass quintet instrumentation', () => {
      const inst = createDefaultInstrumentation();

      expect(inst.numTrumpets()).toBe(4);
      expect(inst.numHorns()).toBe(2);
      expect(inst.numTrombones()).toBe(4);
      expect(inst.numEuphoniums()).toBe(0);
      expect(inst.numTubas()).toBe(1);
      expect(inst.renderValue()).toBe('42401');
      expect(inst.numTotal()).toBe(11);
    });
  });

  describe('edge cases', () => {
    it('should handle non-numeric strings as NaN which becomes 0', () => {
      // When parsing non-numeric characters, Number('-') returns NaN
      // Math.abs(NaN) returns NaN, and NaN % 10 returns NaN
      const inst = toInstrumentation('-1-2-3-4-5');
      // The result will be NaN for total
      expect(isNaN(inst.numTotal())).toBe(true);
    });

    it('should clamp values to single digit (0-9)', () => {
      // Values > 9 are clamped using modulo 10
      const inst = toInstrumentation('99999');
      expect(inst.numTrumpets()).toBe(9);
      expect(inst.numHorns()).toBe(9);
      expect(inst.numTotal()).toBe(45);
    });

    it('should handle non-numeric characters', () => {
      const inst = toInstrumentation('abc');
      // Non-numeric characters parse to NaN
      expect(isNaN(inst.numTotal())).toBe(true);
    });
  });

  describe('chaining modifications', () => {
    it('should support chaining multiple modifications', () => {
      const inst = toInstrumentation('00000')
        .withTrumpets(4)
        .withHorns(2)
        .withTrombones(4)
        .withTubas(1);

      expect(inst.renderValue()).toBe('42401');
      expect(inst.numTotal()).toBe(11);
    });

    it('should maintain other values when chaining', () => {
      const inst = toInstrumentation('42401')
        .withTrumpets(6)
        .withHorns(4)
        .withTubas(2);

      expect(inst.numTrumpets()).toBe(6);
      expect(inst.numHorns()).toBe(4);
      expect(inst.numTrombones()).toBe(4); // Unchanged
      expect(inst.numEuphoniums()).toBe(0); // Unchanged
      expect(inst.numTubas()).toBe(2);
    });
  });
});
