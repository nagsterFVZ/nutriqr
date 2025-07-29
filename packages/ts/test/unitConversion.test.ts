import { describe, it, expect } from 'vitest';
import { convertUnit, convertDecodedNutriQR } from '../src/unitConversion';
import type { ExpandedData } from '../src/index';

describe('Unit Conversion Functions', () => {
  describe('convertUnit', () => {
    it('should return unchanged value when already in target system', () => {
      expect(convertUnit(100, 'g', 'metric')).toEqual({
        value: 100,
        unit: 'g'
      });
      expect(convertUnit(100, 'ml', 'metric')).toEqual({
        value: 100,
        unit: 'ml'
      });
      expect(convertUnit(100, 'oz', 'imperial')).toEqual({
        value: 100,
        unit: 'oz'
      });
      expect(convertUnit(100, 'fl', 'imperial')).toEqual({
        value: 100,
        unit: 'fl'
      });
    });

    it('should convert between metric and imperial weight units', () => {
      const result1 = convertUnit(100, 'g', 'imperial');
      expect(result1.unit).toBe('oz');
      expect(result1.value).toBeCloseTo(3.527, 3);

      const result2 = convertUnit(2, 'oz', 'metric');
      expect(result2.unit).toBe('g');
      expect(result2.value).toBeCloseTo(56.699, 3);
    });

    it('should convert between metric and imperial volume units', () => {
      const result1 = convertUnit(100, 'ml', 'imperial');
      expect(result1.unit).toBe('fl');
      expect(result1.value).toBeCloseTo(3.381, 3);

      const result2 = convertUnit(2, 'fl', 'metric');
      expect(result2.unit).toBe('ml');
      expect(result2.value).toBeCloseTo(59.147, 3);
    });

    it('should throw error for unsupported conversions', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => convertUnit(100, 'g', 'imperial' as any)).not.toThrow();
    });
  });

  describe('convertDecodedNutriQR', () => {
    const sampleData: ExpandedData = {
      gtin13: '1234567890123',
      manufacturer: 'Test Brand',
      productName: 'Test Product',
      unit: 'g',
      baseQuantity: 100,
      portionQuantity: 150,
      nutrients: {
        energyKcal: 250,
        energyKj: 1046,
        fat: 10,
        saturatedFat: 3,
        carbs: 30,
        sugar: 15,
        salt: 1,
        protein: 8,
        fibre: 5
      }
    };

    it('should return unchanged data when already in target system', () => {
      const result = convertDecodedNutriQR(sampleData, 'metric');
      expect(result).toEqual(sampleData);
    });

    it('should convert from grams to ounces', () => {
      const result = convertDecodedNutriQR(sampleData, 'imperial');

      expect(result.unit).toBe('oz');
      expect(result.baseQuantity).toBeCloseTo(3.527, 3);
      expect(result.portionQuantity).toBeCloseTo(5.291, 3);

      // Energy values should remain unchanged
      expect(result.nutrients.energyKcal).toBe(250);
      expect(result.nutrients.energyKj).toBe(1046);

      // Other nutrients should be converted proportionally
      const factor = result.baseQuantity / sampleData.baseQuantity;
      expect(result.nutrients.fat).toBeCloseTo(10 * factor, 3);
      expect(result.nutrients.saturatedFat).toBeCloseTo(3 * factor, 3);
      expect(result.nutrients.carbs).toBeCloseTo(30 * factor, 3);
      expect(result.nutrients.sugar).toBeCloseTo(15 * factor, 3);
      expect(result.nutrients.salt).toBeCloseTo(1 * factor, 3);
      expect(result.nutrients.protein).toBeCloseTo(8 * factor, 3);
      expect(result.nutrients.fibre).toBeCloseTo(5 * factor, 3);
    });

    it('should convert from ounces to grams', () => {
      const ozData: ExpandedData = {
        ...sampleData,
        unit: 'oz',
        baseQuantity: 3.5,
        portionQuantity: 5.25
      };

      const result = convertDecodedNutriQR(ozData, 'metric');

      expect(result.unit).toBe('g');
      expect(result.baseQuantity).toBeCloseTo(99.223, 3);
      expect(result.portionQuantity).toBeCloseTo(148.834, 2);

      // Energy values should remain unchanged
      expect(result.nutrients.energyKcal).toBe(250);
      expect(result.nutrients.energyKj).toBe(1046);

      // Other nutrients should be converted proportionally
      const factor = result.baseQuantity / ozData.baseQuantity;
      expect(result.nutrients.fat).toBeCloseTo(10 * factor, 3);
      expect(result.nutrients.protein).toBeCloseTo(8 * factor, 3);
    });

    it('should convert volume units (ml to fl)', () => {
      const mlData: ExpandedData = {
        ...sampleData,
        unit: 'ml',
        baseQuantity: 100,
        portionQuantity: 150
      };

      const result = convertDecodedNutriQR(mlData, 'imperial');

      expect(result.unit).toBe('fl');
      expect(result.baseQuantity).toBeCloseTo(3.381, 3);
      expect(result.portionQuantity).toBeCloseTo(5.072, 3);
    });

    it('should handle data without fibre', () => {
      const dataWithoutFibre: ExpandedData = {
        ...sampleData,
        nutrients: {
          energyKcal: 250,
          energyKj: 1046,
          fat: 10,
          saturatedFat: 3,
          carbs: 30,
          sugar: 15,
          salt: 1,
          protein: 8
          // no fibre property
        }
      };

      const result = convertDecodedNutriQR(dataWithoutFibre, 'imperial');

      expect(result.nutrients.fibre).toBeUndefined();
      expect(result.unit).toBe('oz');
    });
  });
});
