/**
 * Validation functions for NutriQR
 */

import { splitEscapedDelimiter } from './utils.js';
import { NutriQRErrorType } from './errors.js';

/**
 * Validates a NutriQR array structure
 * @param arr - The array to validate
 * @returns null if valid, error type if invalid
 */
export function validateNutriQRArray(arr: unknown[]): NutriQRErrorType | null {
  // Top-level array length
  if (!Array.isArray(arr) || arr.length !== 6)
    return NutriQRErrorType.INVALID_ARRAY_LENGTH;

  // GTIN-13
  if (typeof arr[0] !== 'string' || !(arr[0] === '' || /^\d{13}$/.test(arr[0])))
    return NutriQRErrorType.INVALID_GTIN13;

  // Brand|Product with escaping
  if (typeof arr[1] !== 'string' || arr[1].length < 1)
    return NutriQRErrorType.EMPTY_BRAND_PRODUCT;

  // Use splitEscapedDelimiter for Brand|Product
  const split = splitEscapedDelimiter(arr[1] as string, '|');
  if (!split) return NutriQRErrorType.MISSING_DELIMITER;

  const [manufacturer, productName] = split;
  if (!manufacturer || !productName)
    return NutriQRErrorType.EMPTY_MANUFACTURER_OR_PRODUCT;

  // Unit
  if (typeof arr[2] !== 'string' || !['g', 'ml', 'oz', 'fl'].includes(arr[2]))
    return NutriQRErrorType.INVALID_UNIT;

  // Base quantity
  if (typeof arr[3] !== 'number' || !isFinite(arr[3]) || arr[3] <= 0)
    return NutriQRErrorType.INVALID_BASE_QUANTITY;

  // Portion factor
  if (typeof arr[4] !== 'number' || !isFinite(arr[4]) || arr[4] <= 0)
    return NutriQRErrorType.INVALID_PORTION_FACTOR;

  // Nutrients
  if (!Array.isArray(arr[5]) || arr[5].length < 7 || arr[5].length > 8)
    return NutriQRErrorType.INVALID_NUTRIENTS_ARRAY;

  const n = arr[5];
  for (let i = 0; i < n.length; i++) {
    if (typeof n[i] !== 'number' || !isFinite(n[i]) || n[i] < 0)
      return NutriQRErrorType.INVALID_NUTRIENT_VALUE;
  }

  // Validation rules
  if (n[4] > n[3]) return NutriQRErrorType.SUGAR_EXCEEDS_CARBS;
  if (n[2] > n[1]) return NutriQRErrorType.SATURATED_FAT_EXCEEDS_TOTAL_FAT;

  // Exclude saturated fat (n[2]) and sugar (n[4]) from total, as they are included in fat and carbs
  const totalNutrients = n[0] + n[1] + n[3] + n[5] + n[6];
  if (totalNutrients > arr[3])
    return NutriQRErrorType.NUTRIENTS_EXCEED_BASE_QUANTITY;

  return null;
}
