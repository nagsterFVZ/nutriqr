import { describe, it, expect } from 'vitest';
import {
  decodeNutriQRString,
  createNutriQRString,
  NutriQRErrorType
} from '../src/index';
import { expectNutriQRErrorThrown } from './testUtils';

const goodNutrients = {
  energyKcal: 50,
  fat: 10,
  saturatedFat: 5,
  carbs: 20,
  sugar: 10,
  salt: 1,
  protein: 4
};

describe('decodeNutriQRString', () => {
  it('decodes valid string', () => {
    const validNutriQR = [
      '8720828249062',
      'Brand|Product',
      'g',
      100,
      1,
      [50, 10, 5, 20, 10, 1, 4]
    ];
    const validNutriQRString = JSON.stringify(validNutriQR);
    const result = decodeNutriQRString(validNutriQRString);
    expect(result.manufacturer).toBe('Brand');
    expect(result.productName).toBe('Product');
    expect(result.unit).toBe('g');
    expect(result.baseQuantity).toBe(100);
    expect(result.portionQuantity).toBe(100);
    expect(result.nutrients.energyKcal).toBe(50);
    expect(result.nutrients.energyKj).toBe(Math.round(50 * 4.184));
    expect(result.nutrients.fat).toBe(10);
    expect(result.nutrients.saturatedFat).toBe(5);
    expect(result.nutrients.carbs).toBe(20);
    expect(result.nutrients.sugar).toBe(10);
    expect(result.nutrients.salt).toBe(1);
    expect(result.nutrients.protein).toBe(4);
    expect(result.nutrients.fibre).toBeUndefined();
  });

  it('throws on invalid string', () => {
    expectNutriQRErrorThrown(
      () => decodeNutriQRString('not a json'),
      NutriQRErrorType.INVALID_JSON
    );

    expectNutriQRErrorThrown(
      () =>
        decodeNutriQRString(
          JSON.stringify([
            'Brand|Product',
            'g',
            100,
            1,
            [50, 10, 5, 20, 5, 1, 4]
          ])
        ),
      NutriQRErrorType.INVALID_ARRAY_LENGTH
    );
  });

  it('handles escaped | in manufacturer and productName', () => {
    // Manufacturer contains |
    const str1 = createNutriQRString(
      '8720828249062',
      'Bran\\|d',
      'Pro\\|duct',
      'g',
      100,
      1,
      goodNutrients
    );
    const decoded1 = decodeNutriQRString(str1);
    expect(decoded1.manufacturer).toBe('Bran|d');
    expect(decoded1.productName).toBe('Pro|duct');

    // Product name contains multiple escaped |
    const str2 = createNutriQRString(
      '8720828249062',
      'Brand',
      'Pro\\|du\\|ct',
      'g',
      100,
      1,
      goodNutrients
    );
    const decoded2 = decodeNutriQRString(str2);
    expect(decoded2.productName).toBe('Pro|du|ct');
  });

  it('fails if extra | is not escaped', () => {
    // Unescaped | in manufacturer
    const arr = [
      '8720828249062',
      'Brand|With|Pipe|Product',
      'g',
      100,
      1,
      [50, 10, 5, 20, 10, 1, 4]
    ];
    const str = JSON.stringify(arr);

    expectNutriQRErrorThrown(
      () => decodeNutriQRString(str),
      NutriQRErrorType.MISSING_DELIMITER
    );
  });

  it('handles optional fibre nutrient', () => {
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
        protein: 4,
        fibre: 2
      }
    );
    const decoded = decodeNutriQRString(str);
    expect(decoded.nutrients.fibre).toBe(2);
  });
});
