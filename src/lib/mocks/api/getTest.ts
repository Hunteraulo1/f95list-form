/**
 * @param {string} [optionalArgs] - Optional parameter containing a custom text.
 * @returns {string}
 */
export function getTest(text: string): string {
  return text || "test";
}
