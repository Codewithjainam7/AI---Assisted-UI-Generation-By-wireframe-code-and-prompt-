/**
 * Client-side ID helper utilities
 */

/** Returns true if a string looks like a valid 10-digit fieldId */
export function isValidFieldId(id) {
  return typeof id === 'string' && /^\d{10}$/.test(id);
}

/** Returns true if a string is a TBD placeholder */
export function isTBDPlaceholder(id) {
  return typeof id === 'string' && id.startsWith('TBD-');
}
