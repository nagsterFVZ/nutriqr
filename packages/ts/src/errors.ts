/**
 * Error types and messages for NutriQR validation
 */

export enum NutriQRErrorType {
  INVALID_ARRAY_LENGTH = 'INVALID_ARRAY_LENGTH',
  INVALID_GTIN13 = 'INVALID_GTIN13',
  EMPTY_BRAND_PRODUCT = 'EMPTY_BRAND_PRODUCT',
  MISSING_DELIMITER = 'MISSING_DELIMITER',
  EMPTY_MANUFACTURER_OR_PRODUCT = 'EMPTY_MANUFACTURER_OR_PRODUCT',
  INVALID_UNIT = 'INVALID_UNIT',
  INVALID_BASE_QUANTITY = 'INVALID_BASE_QUANTITY',
  INVALID_PORTION_FACTOR = 'INVALID_PORTION_FACTOR',
  INVALID_NUTRIENTS_ARRAY = 'INVALID_NUTRIENTS_ARRAY',
  INVALID_NUTRIENT_VALUE = 'INVALID_NUTRIENT_VALUE',
  SUGAR_EXCEEDS_CARBS = 'SUGAR_EXCEEDS_CARBS',
  SATURATED_FAT_EXCEEDS_TOTAL_FAT = 'SATURATED_FAT_EXCEEDS_TOTAL_FAT',
  NUTRIENTS_EXCEED_BASE_QUANTITY = 'NUTRIENTS_EXCEED_BASE_QUANTITY',
  INVALID_JSON = 'INVALID_JSON',
  NON_STRING_INPUT = 'NON_STRING_INPUT'
}

export const ERROR_MESSAGES: Record<NutriQRErrorType, string> = {
  [NutriQRErrorType.INVALID_ARRAY_LENGTH]:
    'Top-level array must have 6 elements.',
  [NutriQRErrorType.INVALID_GTIN13]:
    'GTIN-13 must be an empty string or a 13-digit string.',
  [NutriQRErrorType.EMPTY_BRAND_PRODUCT]:
    'Brand|Product must be a non-empty string.',
  [NutriQRErrorType.MISSING_DELIMITER]:
    'Brand|Product must include a | delimiter (unescaped) between manufacturer and product name.',
  [NutriQRErrorType.EMPTY_MANUFACTURER_OR_PRODUCT]:
    'Both manufacturer and product name must be non-empty.',
  [NutriQRErrorType.INVALID_UNIT]: 'Unit must be one of "g", "ml", "oz", "fl".',
  [NutriQRErrorType.INVALID_BASE_QUANTITY]:
    'Base quantity must be a positive number.',
  [NutriQRErrorType.INVALID_PORTION_FACTOR]:
    'Portion factor must be a positive number.',
  [NutriQRErrorType.INVALID_NUTRIENTS_ARRAY]:
    'Nutrients array must have 7 or 8 elements.',
  [NutriQRErrorType.INVALID_NUTRIENT_VALUE]:
    'Nutrient at index {index} must be a non-negative number.',
  [NutriQRErrorType.SUGAR_EXCEEDS_CARBS]:
    'Sugars must be less than or equal to carbohydrates.',
  [NutriQRErrorType.SATURATED_FAT_EXCEEDS_TOTAL_FAT]:
    'Saturated fat must be less than or equal to total fat.',
  [NutriQRErrorType.NUTRIENTS_EXCEED_BASE_QUANTITY]:
    'Sum of nutrients (excluding saturated fat and sugar) must not exceed base quantity.',
  [NutriQRErrorType.INVALID_JSON]: 'Invalid JSON string.',
  [NutriQRErrorType.NON_STRING_INPUT]: 'Input must be a string.'
};

/**
 * Custom error class for NutriQR validation errors
 */
export class NutriQRError extends Error {
  public readonly errorType: NutriQRErrorType;

  constructor(errorType: NutriQRErrorType, customMessage?: string) {
    const message = customMessage || ERROR_MESSAGES[errorType];
    super(`NutriQR validation failed: ${message}`);
    this.name = 'NutriQRError';
    this.errorType = errorType;
  }
}
