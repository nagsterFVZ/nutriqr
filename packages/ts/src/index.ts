/**
 * NutriQR - Nutrient QR Code Library
 *
 * A TypeScript library for encoding and decoding nutrition information
 * in QR codes according to the NutriQR specification v1.0.
 */

// Export all types
export type {
  NutriQRUnit,
  NutriQR,
  ExpandedData,
  NutrientInput,
  NutriQRPrefixMatch
} from './types.js';

// Export error types and classes
export { NutriQRErrorType, NutriQRError, ERROR_MESSAGES } from './errors.js';

// Export envelope constants
export {
  NUTRIQR_VERSION,
  NUTRIQR_PREFIX,
  NUTRIQR_PREFIX_REGEX
} from './constants.js';

// Export utility functions
export { splitEscapedDelimiter, parseNutriQRPrefix } from './utils.js';

// Export validation functions
export { validateNutriQRArray } from './validation.js';

// Export codec functions
export {
  isNutriQRString,
  decodeNutriQRString,
  createNutriQRString
} from './codec.js';

// Export unit conversion functions
export { convertUnit, convertDecodedNutriQR } from './unitConversion.js';
