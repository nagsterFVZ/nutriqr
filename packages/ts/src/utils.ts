/**
 * Utility functions for NutriQR
 */

import { NUTRIQR_PREFIX_REGEX } from './constants.js';
import type { NutriQRPrefixMatch } from './types.js';

/**
 * Strips and parses a leading "NQR<version>:" envelope prefix from a raw string.
 * Returns null if the string does not start with a syntactically valid prefix
 * (missing, wrong case, wrong separator, non-numeric version, etc).
 * Does not judge whether the parsed version is supported - callers check that.
 */
export function parseNutriQRPrefix(str: string): NutriQRPrefixMatch | null {
  const match = NUTRIQR_PREFIX_REGEX.exec(str);
  if (!match) return null;
  return {
    version: parseInt(match[1], 10),
    remainder: str.slice(match[0].length)
  };
}

/**
 * Utility to split on first unescaped delimiter and unescape
 */
export function splitEscapedDelimiter(
  str: string,
  delimiter: string = '|'
): [string, string] | null {
  let idx = -1;
  let unescapedDelimiterCount = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === delimiter) {
      let backslashes = 0;
      let j = i - 1;
      while (j >= 0 && str[j] === '\\') {
        backslashes++;
        j--;
      }
      if (backslashes % 2 === 0) {
        unescapedDelimiterCount++;
        if (idx === -1) {
          idx = i;
        }
      }
    }
  }

  // Must have exactly one unescaped delimiter
  if (unescapedDelimiterCount !== 1) return null;

  const left = str.slice(0, idx).replace(/\\\|/g, '|').trim();
  const right = str
    .slice(idx + 1)
    .replace(/\\\|/g, '|')
    .trim();
  return [left, right];
}
