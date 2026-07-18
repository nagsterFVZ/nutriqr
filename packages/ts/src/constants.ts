/**
 * Envelope prefix/version constants for NutriQR
 */

/** Current array-layout version this library implements (matches spec v1.0). */
export const NUTRIQR_VERSION = 1;

/** Magic prefix + version identifier that must lead every NutriQR payload string. */
export const NUTRIQR_PREFIX = `NQR${NUTRIQR_VERSION}:`;

/**
 * Matches a syntactically valid NutriQR envelope prefix at the start of a string:
 * "NQR" + one-or-more ASCII digits + ":". Capture group 1 is the version, as a string.
 */
export const NUTRIQR_PREFIX_REGEX = /^NQR(\d+):/;
