import { describe, it, expect } from 'vitest';
import {
  isNutriQRString,
  decodeNutriQRString,
  createNutriQRString
} from '../src/index';

describe('NutriQR Spec v1.0 Functions', () => {
  const validNutriQR = [
    '8720828249062',
    'Brand|Product',
    'g',
    100,
    1,
    [50, 10, 5, 20, 10, 1, 4]
  ];
  const validNutriQRString = JSON.stringify(validNutriQR);

  it('isNutriQRString returns true for valid NutriQR string', () => {
    expect(isNutriQRString(validNutriQRString)).toBe(true);
  });

  it('isNutriQRString returns false for invalid NutriQR string', () => {
    expect(isNutriQRString('not a json')).toBe(false);
    expect(
      isNutriQRString(
        JSON.stringify([
          '8720828249062',
          'Brand|Product',
          'g',
          100,
          1,
          [50, 10, 5, 20, 25, 1, 4]
        ])
      )
    ).toBe(false); // sugar > carbs
    expect(
      isNutriQRString(
        JSON.stringify([
          '8720828249062',
          'Brand|Product',
          'g',
          100,
          1,
          [50, 5, 10, 20, 10, 1, 4]
        ])
      )
    ).toBe(false); // sat fat > fat
    expect(
      isNutriQRString(
        JSON.stringify([
          '8720828249062',
          'Brand|Product',
          'g',
          100,
          1,
          [50, 10, 5, 20, 10, 1]
        ])
      )
    ).toBe(false); // too few nutrients
    expect(
      isNutriQRString(
        JSON.stringify([
          '8720828249062',
          'Brand|Product',
          'g',
          100,
          1,
          [50, 10, 5, 20, 10, 1, 4, 2, 1]
        ])
      )
    ).toBe(false); // too many nutrients
  });

  it('decodeNutriQRString decodes valid string', () => {
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

  it('decodeNutriQRString throws on invalid string', () => {
    expect(() => decodeNutriQRString('not a json')).toThrow(
      'Invalid JSON string.'
    );
    expect(() =>
      decodeNutriQRString(
        JSON.stringify([
          'Brand|Product',
          'g',
          100,
          1,
          [50, 10, 5, 20, 25, 1, 4]
        ])
      )
    ).toThrow(/NutriQR validation failed/);
  });

  it('createNutriQRString creates valid NutriQR string', () => {
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

  it('createNutriQRString throws on invalid input', () => {
    expect(() =>
      createNutriQRString('', '', 'Product', 'g', 100, 1, {
        energyKcal: 50,
        fat: 10,
        saturatedFat: 5,
        carbs: 20,
        sugar: 25,
        salt: 1,
        protein: 4
      })
    ).toThrow(/NutriQR validation failed/);
    expect(() =>
      createNutriQRString('123456789', '', 'Product', 'g', 100, 1, {
        energyKcal: 50,
        fat: 10,
        saturatedFat: 5,
        carbs: 20,
        sugar: 25,
        salt: 1,
        protein: 4
      })
    ).toThrow(/NutriQR validation failed/);
    expect(() =>
      createNutriQRString('8720828249062', 'Brand', 'Product', 'g', -1, 1, {
        energyKcal: 50,
        fat: 10,
        saturatedFat: 5,
        carbs: 20,
        sugar: 10,
        salt: 1,
        protein: 4
      })
    ).toThrow(/NutriQR validation failed/);
    expect(() =>
      createNutriQRString('8720828249062', 'Brand', 'Product', 'g', 100, 1, {
        energyKcal: 50,
        fat: 10,
        saturatedFat: 5,
        carbs: 20,
        sugar: 25,
        salt: 1,
        protein: 4
      })
    ).toThrow(/NutriQR validation failed/);
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
