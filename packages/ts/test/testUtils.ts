/**
 * Test utilities for NutriQR tests
 */

import { expect } from 'vitest';
import { NutriQRError, NutriQRErrorType, NUTRIQR_PREFIX } from '../src/index.js';

/**
 * Wraps a raw array with the current spec's envelope prefix, for building test
 * fixtures that bypass createNutriQRString's own encoding/validation.
 */
export function toRawNutriQRString(arr: unknown[]): string {
  return `${NUTRIQR_PREFIX}${JSON.stringify(arr)}`;
}

/**
 * Helper function to assert that an error is a NutriQRError with the expected error type
 * @param error - The error object to check
 * @param expectedErrorType - The expected NutriQRErrorType
 */
export function expectNutriQRError(
  error: unknown,
  expectedErrorType: NutriQRErrorType
): void {
  expect(error).toBeInstanceOf(NutriQRError);
  expect((error as NutriQRError).errorType).toBe(expectedErrorType);
}

/**
 * Helper function to test that a function throws a NutriQRError with the expected error type
 * @param fn - The function to test
 * @param expectedErrorType - The expected NutriQRErrorType
 */
export function expectNutriQRErrorThrown(
  fn: () => void,
  expectedErrorType: NutriQRErrorType
): void {
  try {
    fn();
    expect.fail('Expected function to throw a NutriQRError');
  } catch (error) {
    expectNutriQRError(error, expectedErrorType);
  }
}
