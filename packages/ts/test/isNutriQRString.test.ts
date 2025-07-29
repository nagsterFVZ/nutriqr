import { describe, it, expect } from 'vitest';
import { isNutriQRString, createNutriQRString } from '../src/index';

const goodNutrients = {
  energyKcal: 50,
  fat: 10,
  saturatedFat: 5,
  carbs: 20,
  sugar: 10,
  salt: 1,
  protein: 4
};

describe('isNutriQRString', () => {
  it('returns true for valid NutriQR string', () => {
    const validNutriQR = [
      '8720828249062',
      'Brand|Product',
      'g',
      100,
      1,
      [50, 10, 5, 20, 10, 1, 4]
    ];
    const validNutriQRString = JSON.stringify(validNutriQR);
    expect(isNutriQRString(validNutriQRString)).toBe(true);
  });

  it('returns false for invalid NutriQR string', () => {
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

  it('returns false for string with unescaped |', () => {
    const arr = [
      '8720828249062',
      'Brand|With|Pipe|Product',
      'g',
      100,
      1,
      [50, 10, 5, 20, 25, 1, 4]
    ];
    const str = JSON.stringify(arr);
    expect(isNutriQRString(str)).toBe(false);
  });

  it('returns true for string with escaped |', () => {
    const str1 = createNutriQRString(
      '8720828249062',
      'Bran\\|d',
      'Pro\\|duct',
      'g',
      100,
      1,
      goodNutrients
    );
    expect(isNutriQRString(str1)).toBe(true);
    const str2 = createNutriQRString(
      '8720828249062',
      'Brand',
      'Pro\\|du\\|ct',
      'g',
      100,
      1,
      goodNutrients
    );
    expect(isNutriQRString(str2)).toBe(true);
  });
});
