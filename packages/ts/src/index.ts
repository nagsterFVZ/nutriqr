// Utility to split on first unescaped delimiter and unescape
function splitEscapedDelimiter(
  str: string,
  delimiter: string = '|'
): [string, string] | null {
  let idx = -1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === delimiter) {
      let backslashes = 0;
      let j = i - 1;
      while (j >= 0 && str[j] === '\\') {
        backslashes++;
        j--;
      }
      if (backslashes % 2 === 0) {
        idx = i;
        break;
      }
    }
  }
  if (idx === -1) return null;
  const left = str.slice(0, idx).replace(/\\\|/g, '|').trim();
  const right = str
    .slice(idx + 1)
    .replace(/\\\|/g, '|')
    .trim();
  return [left, right];
}

// NutriQR Spec v1.0 Functions

export type NutriQRUnit = 'g' | 'ml' | 'oz' | 'fl';

export type NutriQR = [
  string,
  string,
  NutriQRUnit,
  number,
  number,
  [number, number, number, number, number, number, number, number?]
];

export interface ExpandedData {
  gtin13: string;
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
  if (!Array.isArray(arr) || arr.length !== 6)
    return 'Top-level array must have 6 elements.';
  // GTIN-13
  if (typeof arr[0] !== 'string' || !(arr[0] === '' || /^\d{13}$/.test(arr[0])))
    return 'GTIN-13 must be an empty string or a 13-digit string.';
  // Brand|Product with escaping
  if (typeof arr[1] !== 'string' || arr[1].length < 1)
    return 'Brand|Product must be a non-empty string.';
  // Use splitEscapedDelimiter for Brand|Product
  const split = splitEscapedDelimiter(arr[1] as string, '|');
  if (!split)
    return 'Brand|Product must include a | delimiter (unescaped) between manufacturer and product name.';
  const [manufacturer, productName] = split;
  if (!manufacturer || !productName)
    return 'Both manufacturer and product name must be non-empty.';
  // Unit
  if (typeof arr[2] !== 'string' || !['g', 'ml', 'oz', 'fl'].includes(arr[2]))
    return 'Unit must be one of "g", "ml", "oz", "fl".';
  // Base quantity
  if (typeof arr[3] !== 'number' || !isFinite(arr[3]) || arr[3] <= 0)
    return 'Base quantity must be a positive number.';
  // Portion factor
  if (typeof arr[4] !== 'number' || !isFinite(arr[4]) || arr[4] <= 0)
    return 'Portion factor must be a positive number.';
  // Nutrients
  if (!Array.isArray(arr[5]) || arr[5].length < 7 || arr[5].length > 8)
    return 'Nutrients array must have 7 or 8 elements.';
  const n = arr[5];
  for (let i = 0; i < n.length; i++) {
    if (typeof n[i] !== 'number' || !isFinite(n[i]) || n[i] < 0)
      return `Nutrient at index ${i} must be a non-negative number.`;
  }
  // Validation rules
  if (n[4] > n[3]) return 'Sugars must be less than or equal to carbohydrates.';
  if (n[2] > n[1])
    return 'Saturated fat must be less than or equal to total fat.';
  // Exclude saturated fat (n[2]) and sugar (n[4]) from total, as they are included in fat and carbs
  const totalNutrients = n[0] + n[1] + n[3] + n[5] + n[6];
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

export function createNutriQRString(
  gtin13: string,
  manufacturer: string,
  productName: string,
  unit: NutriQRUnit,
  baseQuantity: number,
  portionFactor: number,
  nutrients: {
    energyKcal: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugar: number;
    salt: number;
    protein: number;
    fibre?: number;
  }
): string {
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
    `${manufacturer}|${productName}`,
    unit,
    baseQuantity,
    portionFactor,
    nutrientsArr
  ];
  const error = validateNutriQRArray(arr);
  if (error) throw new Error('NutriQR validation failed: ' + error);
  return JSON.stringify(arr);
}
