// NutriQR Spec v1.0 Functions

export type NutriQRUnit = 'g' | 'ml' | 'oz' | 'fl';

export type NutriQR = [
  string,
  NutriQRUnit,
  number,
  number,
  [number, number, number, number, number, number, number, number?]
];

export interface ExpandedData {
  manufacturer: string;
  productName: string;
  unit: NutriQRUnit;
  baseQuantity: number;
  portionQuantity: number;
  nutrients: {
    energyKcal: number;
    energyKj: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugar: number;
    salt: number;
    protein: number;
    fibre?: number;
  };
}

function validateNutriQRArray(arr: unknown[]): string | null {
  // Top-level array length
  if (!Array.isArray(arr) || arr.length !== 5)
    return 'Top-level array must have 5 elements.';
  // Brand|Product
  if (typeof arr[0] !== 'string' || arr[0].length < 1)
    return 'Brand|Product must be a non-empty string.';
  if (
    !arr[0].includes('|') ||
    arr[0].split('|').length !== 2 ||
    arr[0].split('|')[0].trim() === '' ||
    arr[0].split('|')[1].trim() === ''
  )
    return 'Brand|Product must include a | delimiter and both manufacturer and product name must be non-empty.';
  // Unit
  if (typeof arr[1] !== 'string' || !['g', 'ml', 'oz', 'fl'].includes(arr[1]))
    return 'Unit must be one of "g", "ml", "oz", "fl".';
  // Base quantity
  if (typeof arr[2] !== 'number' || !isFinite(arr[2]) || arr[2] <= 0)
    return 'Base quantity must be a positive number.';
  // Portion factor
  if (typeof arr[3] !== 'number' || !isFinite(arr[3]) || arr[3] <= 0)
    return 'Portion factor must be a positive number.';
  // Nutrients
  if (!Array.isArray(arr[4]) || arr[4].length < 7 || arr[4].length > 8)
    return 'Nutrients array must have 7 or 8 elements.';
  const n = arr[4];
  for (let i = 0; i < n.length; i++) {
    if (typeof n[i] !== 'number' || !isFinite(n[i]) || n[i] < 0)
      return `Nutrient at index ${i} must be a non-negative number.`;
  }
  // Validation rules
  if (n[4] > n[3]) return 'Sugars must be less than or equal to carbohydrates.';
  if (n[2] > n[1])
    return 'Saturated fat must be less than or equal to total fat.';
  // Exclude saturated fat (n[2]) and sugar (n[4]) from total, as they are included in fat and carbs
  const totalNutrients =
    n[0] + n[1] + n[3] + n[5] + n[6] + (n.length === 8 ? n[7] : 0);
  if (totalNutrients > arr[2])
    return 'Sum of nutrients (excluding saturated fat and sugar) must not exceed base quantity.';
  return null;
}

export function isNutriQRString(str: string): boolean {
  try {
    const arr = JSON.parse(str);
    return validateNutriQRArray(arr) === null;
  } catch {
    return false;
  }
}

export function decodeNutriQRString(str: string): ExpandedData {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string.');
  }
  let arr: unknown;
  try {
    arr = JSON.parse(str);
  } catch {
    throw new Error('Invalid JSON string.');
  }
  const error = validateNutriQRArray(arr as unknown[]);
  if (error) throw new Error('NutriQR validation failed: ' + error);
  const a = arr as NutriQR;
  // Split manufacturer and product
  const [manufacturer, productName] = a[0].split('|');
  const nutrientsArr = a[4];
  return {
    manufacturer: manufacturer || '',
    productName: productName || '',
    unit: a[1],
    baseQuantity: a[2],
    portionQuantity: a[2] * a[3],
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

export function createNutriQRString(
  manufacturer: string,
  productName: string,
  unit: NutriQRUnit,
  baseQuantity: number,
  portionFactor: number,
  nutrients: [number, number, number, number, number, number, number, number?]
): string {
  const arr: NutriQR = [
    `${manufacturer}|${productName}`,
    unit,
    baseQuantity,
    portionFactor,
    nutrients
  ];
  const error = validateNutriQRArray(arr);
  if (error) throw new Error('NutriQR validation failed: ' + error);
  return JSON.stringify(arr);
}
