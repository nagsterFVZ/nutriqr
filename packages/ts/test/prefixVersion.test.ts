import { describe, it, expect } from 'vitest';
import {
  createNutriQRString,
  decodeNutriQRString,
  isNutriQRString,
  NutriQRErrorType,
  NUTRIQR_VERSION,
  NUTRIQR_PREFIX
} from '../src/index';
import { expectNutriQRErrorThrown } from './testUtils';

const validArray = [
  '8720828249062',
  'Brand|Product',
  'g',
  100,
  1,
  [50, 10, 5, 20, 10, 1, 4]
];

describe('NQR envelope prefix and versioning', () => {
  it('exposes the expected version and prefix constants', () => {
    expect(NUTRIQR_VERSION).toBe(1);
    expect(NUTRIQR_PREFIX).toBe('NQR1:');
  });

  it('round-trips through create/isNutriQRString/decode', () => {
    const created = createNutriQRString(
      '8720828249062',
      'Brand',
      'Product',
      'g',
      100,
      1,
      {
        energyKcal: 50,
        fat: 10,
        saturatedFat: 5,
        carbs: 20,
        sugar: 10,
        salt: 1,
        protein: 4
      }
    );
    expect(created.startsWith(NUTRIQR_PREFIX)).toBe(true);
    expect(isNutriQRString(created)).toBe(true);
    expect(decodeNutriQRString(created).version).toBe(NUTRIQR_VERSION);
  });

  it('rejects the old bare-array format (no prefix)', () => {
    const bare = JSON.stringify(validArray);
    expect(isNutriQRString(bare)).toBe(false);
    expectNutriQRErrorThrown(
      () => decodeNutriQRString(bare),
      NutriQRErrorType.INVALID_PREFIX
    );
  });

  it('rejects malformed prefixes', () => {
    const arrStr = JSON.stringify(validArray);
    const malformed = [
      `NQR:${arrStr}`, // no digits
      `nqr1:${arrStr}`, // wrong case
      `NQR1${arrStr}`, // missing colon
      `NQR1;${arrStr}`, // wrong separator
      ` NQR1:${arrStr}` // leading space
    ];

    for (const str of malformed) {
      expect(isNutriQRString(str)).toBe(false);
      expectNutriQRErrorThrown(
        () => decodeNutriQRString(str),
        NutriQRErrorType.INVALID_PREFIX
      );
    }
  });

  it('rejects unsupported versions', () => {
    const arrStr = JSON.stringify(validArray);

    for (const version of ['0', '2', '99']) {
      const str = `NQR${version}:${arrStr}`;
      expect(isNutriQRString(str)).toBe(false);
      expectNutriQRErrorThrown(
        () => decodeNutriQRString(str),
        NutriQRErrorType.UNSUPPORTED_VERSION
      );
    }
  });

  it('includes the offending version number in the error message', () => {
    const str = `NQR2:${JSON.stringify(validArray)}`;
    try {
      decodeNutriQRString(str);
      expect.fail('Expected function to throw a NutriQRError');
    } catch (error) {
      expect((error as Error).message).toContain('"2"');
    }
  });
});
