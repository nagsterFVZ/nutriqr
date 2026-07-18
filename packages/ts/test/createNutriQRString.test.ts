import { describe, it, expect } from 'vitest';
import {
  createNutriQRString,
  decodeNutriQRString,
  isNutriQRString,
  NutriQRErrorType
} from '../src/index';
import { expectNutriQRErrorThrown } from './testUtils';

describe('createNutriQRString', () => {
  it('creates valid NutriQR string', () => {
    const str = createNutriQRString(
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
    expect(isNutriQRString(str)).toBe(true);
    const decoded = decodeNutriQRString(str);
    expect(decoded.manufacturer).toBe('Brand');
    expect(decoded.productName).toBe('Product');
    expect(decoded.unit).toBe('g');
    expect(decoded.baseQuantity).toBe(100);
    expect(decoded.nutrients.energyKcal).toBe(50);
    expect(decoded.nutrients.fibre).toBeUndefined();
  });

  it('throws on invalid input', () => {
    expectNutriQRErrorThrown(
      () =>
        createNutriQRString('', '', 'Product', 'g', 100, 1, {
          energyKcal: 50,
          fat: 10,
          saturatedFat: 5,
          carbs: 20,
          sugar: 25,
          salt: 1,
          protein: 4
        }),
      NutriQRErrorType.EMPTY_MANUFACTURER_OR_PRODUCT
    );

    expectNutriQRErrorThrown(
      () =>
        createNutriQRString('123456789', '', 'Product', 'g', 100, 1, {
          energyKcal: 50,
          fat: 10,
          saturatedFat: 5,
          carbs: 20,
          sugar: 25,
          salt: 1,
          protein: 4
        }),
      NutriQRErrorType.INVALID_GTIN13
    );

    expectNutriQRErrorThrown(
      () =>
        createNutriQRString('8720828249062', 'Brand', 'Product', 'g', -1, 1, {
          energyKcal: 50,
          fat: 10,
          saturatedFat: 5,
          carbs: 20,
          sugar: 10,
          salt: 1,
          protein: 4
        }),
      NutriQRErrorType.INVALID_BASE_QUANTITY
    );

    expectNutriQRErrorThrown(
      () =>
        createNutriQRString('8720828249062', 'Brand', 'Product', 'g', 100, 1, {
          energyKcal: 50,
          fat: 10,
          saturatedFat: 5,
          carbs: 20,
          sugar: 25,
          salt: 1,
          protein: 4
        }),
      NutriQRErrorType.SUGAR_EXCEEDS_CARBS
    );
  });

  it('accepts high-calorie-density foods (energy is not counted as mass)', () => {
    const str = createNutriQRString(
      '8720828249062',
      'Brand',
      'Pure Oil',
      'g',
      100,
      1,
      {
        energyKcal: 900,
        fat: 100,
        saturatedFat: 15,
        carbs: 0,
        sugar: 0,
        salt: 0,
        protein: 0
      }
    );
    expect(isNutriQRString(str)).toBe(true);
  });

  it('rejects a genuine macronutrient mass overflow', () => {
    expectNutriQRErrorThrown(
      () =>
        createNutriQRString('8720828249062', 'Brand', 'Product', 'g', 100, 1, {
          energyKcal: 50,
          fat: 60,
          saturatedFat: 5,
          carbs: 60,
          sugar: 5,
          salt: 0,
          protein: 0
        }),
      NutriQRErrorType.NUTRIENTS_EXCEED_BASE_QUANTITY
    );
  });
});
