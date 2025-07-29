/**
 * Utility functions for NutriQR
 */

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
