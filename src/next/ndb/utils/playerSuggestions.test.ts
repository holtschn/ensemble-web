/**
 * Tests for playerSuggestions utility functions
 */

import { extractBaseInstrument, mapPartToInstrument, getSuggestedPlayersForPart } from './playerSuggestions';
import type { EnrichedUser } from '@/next/utils/users';

// Mock users for testing
const mockUsers: EnrichedUser[] = [
  {
    id: 1,
    name: 'Alice Müller',
    instruments: ['trp', 'flg'],
    instrumentsString: 'Trompete, Flügelhorn',
    email: 'alice@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 2,
    name: 'Bob Schmidt',
    instruments: ['trp'],
    instrumentsString: 'Trompete',
    email: 'bob@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 3,
    name: 'Clara Weber',
    instruments: ['hrn'],
    instrumentsString: 'Horn',
    email: 'clara@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 4,
    name: 'David Fischer',
    instruments: ['trb'],
    instrumentsString: 'Posaune',
    email: 'david@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 5,
    name: 'Emma Becker',
    instruments: ['trb', 'eup'],
    instrumentsString: 'Posaune, Euphonium',
    email: 'emma@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 6,
    name: 'Frank Wagner',
    instruments: ['tub'],
    instrumentsString: 'Tuba',
    email: 'frank@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 7,
    name: 'Greta Hoffmann',
    instruments: ['org'],
    instrumentsString: 'Orgel',
    email: 'greta@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 8,
    name: 'Hans Schulz',
    instruments: ['pcs'],
    instrumentsString: 'Schlagzeug',
    email: 'hans@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 9,
    name: 'Inge Klein',
    instruments: ['flg'],
    instrumentsString: 'Flügelhorn',
    email: 'inge@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
  {
    id: 10,
    name: 'Julia Krause',
    instruments: null, // No instruments
    instrumentsString: '',
    email: 'julia@test.com',
    phone: null,
    street: null,
    location: null,
    image: null,
    roles: ['user'],
    updatedAt: '2025-01-01',
    createdAt: '2025-01-01',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    loginAttempts: null,
    lockUntil: null,
    password: null,
  },
];

describe('extractBaseInstrument', () => {
  describe('Standard parts (with numbers)', () => {
    it('should extract base instrument from numbered trumpet parts', () => {
      expect(extractBaseInstrument('trp1')).toBe('trp');
      expect(extractBaseInstrument('trp2')).toBe('trp');
      expect(extractBaseInstrument('trp12')).toBe('trp');
    });

    it('should extract base instrument from numbered horn parts', () => {
      expect(extractBaseInstrument('hrn1')).toBe('hrn');
      expect(extractBaseInstrument('hrn4')).toBe('hrn');
    });

    it('should extract base instrument from numbered trombone parts', () => {
      expect(extractBaseInstrument('pos1')).toBe('pos');
      expect(extractBaseInstrument('pos3')).toBe('pos');
    });

    it('should extract base instrument from numbered euphonium parts', () => {
      expect(extractBaseInstrument('eup1')).toBe('eup');
      expect(extractBaseInstrument('eup2')).toBe('eup');
    });

    it('should extract base instrument from numbered tuba parts', () => {
      expect(extractBaseInstrument('tub1')).toBe('tub');
      expect(extractBaseInstrument('tub4')).toBe('tub');
    });

    it('should extract base instrument from numbered flügelhorn parts', () => {
      expect(extractBaseInstrument('flg1')).toBe('flg');
      expect(extractBaseInstrument('flg2')).toBe('flg');
    });
  });

  describe('Singular parts (without numbers)', () => {
    it('should return base instrument for singular parts', () => {
      expect(extractBaseInstrument('trp')).toBe('trp');
      expect(extractBaseInstrument('hrn')).toBe('hrn');
      expect(extractBaseInstrument('pos')).toBe('pos');
      expect(extractBaseInstrument('eup')).toBe('eup');
      expect(extractBaseInstrument('tub')).toBe('tub');
      expect(extractBaseInstrument('org')).toBe('org');
      expect(extractBaseInstrument('perc')).toBe('perc');
      expect(extractBaseInstrument('flg')).toBe('flg');
    });
  });

  describe('Custom parts (with prefixes/underscores)', () => {
    it('should extract instrument from choir-prefixed parts', () => {
      expect(extractBaseInstrument('ch1_trp1')).toBe('trp');
      expect(extractBaseInstrument('ch1_trp2')).toBe('trp');
      expect(extractBaseInstrument('ch2_hrn')).toBe('hrn');
      expect(extractBaseInstrument('ch1_flg1')).toBe('flg');
    });

    it('should extract instrument from solo-prefixed parts', () => {
      expect(extractBaseInstrument('solo_trp')).toBe('trp');
      expect(extractBaseInstrument('solo_flg')).toBe('flg');
    });

    it('should extract instrument from complex custom parts', () => {
      expect(extractBaseInstrument('choir_1_trp1')).toBe('trp');
      expect(extractBaseInstrument('section_a_hrn2')).toBe('hrn');
    });
  });

  describe('Edge cases', () => {
    it('should return null for unrecognized parts', () => {
      expect(extractBaseInstrument('unknown')).toBeNull();
      expect(extractBaseInstrument('xyz123')).toBeNull();
      expect(extractBaseInstrument('ch1_unknown')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractBaseInstrument('')).toBeNull();
    });
  });
});

describe('mapPartToInstrument', () => {
  describe('Standard brass instruments', () => {
    it('should map trumpet parts to trp', () => {
      expect(mapPartToInstrument('trp')).toBe('trp');
      expect(mapPartToInstrument('trp1')).toBe('trp');
      expect(mapPartToInstrument('trp12')).toBe('trp');
    });

    it('should map horn parts to hrn', () => {
      expect(mapPartToInstrument('hrn')).toBe('hrn');
      expect(mapPartToInstrument('hrn2')).toBe('hrn');
    });

    it('should map trombone parts (pos) to trb', () => {
      expect(mapPartToInstrument('pos')).toBe('trb'); // Special mapping!
      expect(mapPartToInstrument('pos1')).toBe('trb');
      expect(mapPartToInstrument('pos3')).toBe('trb');
    });

    it('should map euphonium parts to eup', () => {
      expect(mapPartToInstrument('eup')).toBe('eup');
      expect(mapPartToInstrument('eup1')).toBe('eup');
    });

    it('should map tuba parts to tub', () => {
      expect(mapPartToInstrument('tub')).toBe('tub');
      expect(mapPartToInstrument('tub2')).toBe('tub');
    });
  });

  describe('Special instruments', () => {
    it('should map flügelhorn parts to flg', () => {
      expect(mapPartToInstrument('flg')).toBe('flg');
      expect(mapPartToInstrument('flg1')).toBe('flg');
    });

    it('should map organ to org', () => {
      expect(mapPartToInstrument('org')).toBe('org');
    });

    it('should map percussion (perc) to pcs', () => {
      expect(mapPartToInstrument('perc')).toBe('pcs'); // Special mapping!
    });
  });

  describe('Custom parts', () => {
    it('should map custom trumpet parts to trp', () => {
      expect(mapPartToInstrument('ch1_trp1')).toBe('trp');
      expect(mapPartToInstrument('solo_trp')).toBe('trp');
    });

    it('should map custom flügelhorn parts to flg', () => {
      expect(mapPartToInstrument('ch1_flg1')).toBe('flg');
      expect(mapPartToInstrument('ch2_flg')).toBe('flg');
    });
  });

  describe('Edge cases', () => {
    it('should return null for unrecognized parts', () => {
      expect(mapPartToInstrument('unknown')).toBeNull();
      expect(mapPartToInstrument('xyz')).toBeNull();
    });
  });
});

describe('getSuggestedPlayersForPart', () => {
  describe('Trumpet suggestions', () => {
    it('should suggest trumpet players for trumpet parts (first names only)', () => {
      const suggestions = getSuggestedPlayersForPart('trp1', mockUsers);
      expect(suggestions).toEqual(['Alice', 'Bob']);
    });

    it('should suggest trumpet players for singular trumpet', () => {
      const suggestions = getSuggestedPlayersForPart('trp', mockUsers);
      expect(suggestions).toEqual(['Alice', 'Bob']);
    });

    it('should suggest trumpet players for custom trumpet parts', () => {
      const suggestions = getSuggestedPlayersForPart('ch1_trp1', mockUsers);
      expect(suggestions).toEqual(['Alice', 'Bob']);
    });
  });

  describe('Flügelhorn suggestions', () => {
    it('should suggest flügelhorn players for flügelhorn parts', () => {
      const suggestions = getSuggestedPlayersForPart('flg1', mockUsers);
      expect(suggestions).toEqual(['Alice', 'Inge']);
    });

    it('should suggest flügelhorn players for custom flügelhorn parts', () => {
      const suggestions = getSuggestedPlayersForPart('ch2_flg', mockUsers);
      expect(suggestions).toEqual(['Alice', 'Inge']);
    });
  });

  describe('Horn suggestions', () => {
    it('should suggest horn players for horn parts', () => {
      const suggestions = getSuggestedPlayersForPart('hrn', mockUsers);
      expect(suggestions).toEqual(['Clara']);
    });

    it('should suggest horn players for numbered horn parts', () => {
      const suggestions = getSuggestedPlayersForPart('hrn2', mockUsers);
      expect(suggestions).toEqual(['Clara']);
    });
  });

  describe('Trombone suggestions (pos → trb mapping)', () => {
    it('should suggest trombone players for pos parts', () => {
      const suggestions = getSuggestedPlayersForPart('pos', mockUsers);
      expect(suggestions).toEqual(['David', 'Emma']);
    });

    it('should suggest trombone players for numbered pos parts', () => {
      const suggestions = getSuggestedPlayersForPart('pos2', mockUsers);
      expect(suggestions).toEqual(['David', 'Emma']);
    });
  });

  describe('Euphonium suggestions', () => {
    it('should suggest euphonium players for eup parts', () => {
      const suggestions = getSuggestedPlayersForPart('eup', mockUsers);
      expect(suggestions).toEqual(['Emma']);
    });
  });

  describe('Tuba suggestions', () => {
    it('should suggest tuba players for tub parts', () => {
      const suggestions = getSuggestedPlayersForPart('tub', mockUsers);
      expect(suggestions).toEqual(['Frank']);
    });
  });

  describe('Organ suggestions', () => {
    it('should suggest organ players for org part', () => {
      const suggestions = getSuggestedPlayersForPart('org', mockUsers);
      expect(suggestions).toEqual(['Greta']);
    });
  });

  describe('Percussion suggestions (perc → pcs mapping)', () => {
    it('should suggest percussion players for perc part', () => {
      const suggestions = getSuggestedPlayersForPart('perc', mockUsers);
      expect(suggestions).toEqual(['Hans']);
    });
  });

  describe('Edge cases', () => {
    it('should return empty array for unrecognized parts', () => {
      const suggestions = getSuggestedPlayersForPart('unknown', mockUsers);
      expect(suggestions).toEqual([]);
    });

    it('should return empty array when no users match', () => {
      const suggestions = getSuggestedPlayersForPart('dir', mockUsers);
      expect(suggestions).toEqual([]); // No director in mock users
    });

    it('should handle empty users array', () => {
      const suggestions = getSuggestedPlayersForPart('trp1', []);
      expect(suggestions).toEqual([]);
    });

    it('should filter out users with null instruments', () => {
      const suggestions = getSuggestedPlayersForPart('trp', mockUsers);
      // Julia Krause has null instruments, should not appear
      expect(suggestions).not.toContain('Julia');
    });
  });

  describe('Sorting', () => {
    it('should sort suggestions alphabetically', () => {
      const suggestions = getSuggestedPlayersForPart('trp', mockUsers);
      // Should be alphabetically sorted: Alice < Bob
      expect(suggestions[0]).toBe('Alice');
      expect(suggestions[1]).toBe('Bob');
    });

    it('should use German locale for sorting', () => {
      const usersWithUmlauts: EnrichedUser[] = [
        { ...mockUsers[0], id: 11, name: 'Zoe Ärger', instruments: ['trp'] },
        { ...mockUsers[0], id: 12, name: 'Anna Öffner', instruments: ['trp'] },
        { ...mockUsers[0], id: 13, name: 'Max Übel', instruments: ['trp'] },
      ];
      const suggestions = getSuggestedPlayersForPart('trp', usersWithUmlauts);
      // German locale should sort: Anna, Max, Zoe (first names only)
      expect(suggestions).toEqual(['Anna', 'Max', 'Zoe']);
    });
  });
});
