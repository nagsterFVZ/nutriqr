/**
 * Encoding and decoding functions for NutriQR
 */

import type {
  NutriQR,
  ExpandedData,
  NutriQRUnit,
  NutrientInput
} from './types.js';
import { splitEscapedDelimiter } from './utils.js';
import { validateNutriQRArray } from './validation.js';
import { NutriQRError, NutriQRErrorType } from './errors.js';

/**
 * Checks if a string is a valid NutriQR string
 * @param str - The string to validate
 * @returns true if valid, false otherwise
 */
export function isNutriQRString(str: string): boolean {
  try {
    const arr = JSON.parse(str);
    return validateNutriQRArray(arr) === null;
  } catch {
    return false;
  }
}

/**
 * Decodes a NutriQR string into expanded data
 * @param str - The NutriQR string to decode
 * @returns Expanded data object
 * @throws Error if string is invalid
 */
export function decodeNutriQRString(str: string): ExpandedData {
  if (typeof str !== 'string') {
    throw new NutriQRError(NutriQRErrorType.NON_STRING_INPUT);
  }

  let arr: unknown;
  try {
    arr = JSON.parse(str);
  } catch {
    throw new NutriQRError(NutriQRErrorType.INVALID_JSON);
  }

  const errorType = validateNutriQRArray(arr as unknown[]);
  if (errorType) throw new NutriQRError(errorType);

  const a = arr as NutriQR;

  // Use splitEscapedDelimiter for manufacturer and productName
  let manufacturer = '';
  let productName = '';
  const split = splitEscapedDelimiter(a[1], '|');
  if (split) {
    [manufacturer, productName] = split;
  }

  const nutrientsArr = a[5];
  return {
    gtin13: a[0],
    manufacturer: manufacturer || '',
    productName: productName || '',
    unit: a[2],
    baseQuantity: a[3],
    portionQuantity: a[3] * a[4],
    nutrients: {
      energyKcal: nutrientsArr[0],
      energyKj: Math.round(nutrientsArr[0] * 4.184),
      fat: nutrientsArr[1],
      saturatedFat: nutrientsArr[2],
      carbs: nutrientsArr[3],
      sugar: nutrientsArr[4],
      salt: nutrientsArr[5],
      protein: nutrientsArr[6],
      ...(nutrientsArr.length === 8 ? { fibre: nutrientsArr[7] } : {})
    }
  };
}

/**
 * Creates a NutriQR string from input data
 * @param gtin13 - GTIN-13 code (can be empty string)
 * @param manufacturer - Manufacturer name
 * @param productName - Product name
 * @param unit - Unit of measurement
 * @param baseQuantity - Base quantity
 * @param portionFactor - Portion factor
 * @param nutrients - Nutrient data
 * @returns NutriQR string
 * @throws Error if validation fails
 */
export function createNutriQRString(
  gtin13: string,
  manufacturer: string,
  productName: string,
  unit: NutriQRUnit,
  baseQuantity: number,
  portionFactor: number,
  nutrients: NutrientInput
): string {
  // Only escape unescaped pipe characters
  const escapedManufacturer = manufacturer.replace(/(?<!\\)\|/g, '\\|');
  const escapedProductName = productName.replace(/(?<!\\)\|/g, '\\|');

  const nutrientsArr = [
    nutrients.energyKcal,
    nutrients.fat,
    nutrients.saturatedFat,
    nutrients.carbs,
    nutrients.sugar,
    nutrients.salt,
    nutrients.protein
  ] as [number, number, number, number, number, number, number, number?];

  if (nutrients.fibre !== undefined) {
    nutrientsArr.push(nutrients.fibre);
  }

  const arr: NutriQR = [
    gtin13,
    `${escapedManufacturer}|${escapedProductName}`,
    unit,
    baseQuantity,
    portionFactor,
    nutrientsArr
  ];

  const errorType = validateNutriQRArray(arr);
  if (errorType) throw new NutriQRError(errorType);

  return JSON.stringify(arr);
}
