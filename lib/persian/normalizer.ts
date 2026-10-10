/**
 * Comprehensive Persian text normalizer and linguistic utility module
 * Handles Arabic/Persian letter variants, diacritics, ZWNJ, tatweel, and letter matching.
 */

// All 32 standard Persian alphabet letters in canonical order
export const PERSIAN_ALPHABET = [
  'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د',
  'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ',
  'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و',
  'ه', 'ی'
] as const;

export type PersianLetter = typeof PERSIAN_ALPHABET[number];

// Rare or challenging starting letters for configurable fairness rules
export const CHALLENGING_LETTERS = new Set(['ژ', 'ث', 'ذ', 'ض', 'ظ', 'غ']);

// Diacritics and non-essential Unicode characters in Persian/Arabic
const DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g; // Tanwin, Fatha, Kasra, Damma, Sukun, Tashdid, etc.
const TATWEEL_REGEX = /\u0640/g; // Persian/Arabic kashida (_)
const PUNCTUATION_AND_SPECIALS = /[.,،؛:!؟?()\[\]{}'"«»\-–—_+=\/\\|*&^%$#@~`<>0-9۰-۹]/g;

/**
 * Normalizes Persian input text into canonical searchable form:
 * - Unifies Arabic Kaf (ك) to Persian Kaf (ک)
 * - Unifies Arabic Yeh variants (ي, ى, ئ) to Persian Yeh (ی)
 * - Converts Alef variants (آ, أ, إ, ٱ) to standard Alef (ا)
 * - Converts Heh variants (ة) to (ه)
 * - Converts Waw with Hamza (ؤ) to (و)
 * - Strips all Arabic vowels/diacritics (َ ِ ُ ً ٍ ٌ ّ ْ)
 * - Strips tatweel (ـ)
 * - Removes zero-width non-joiners (ZWNJ \u200C) and extra spaces for canonical comparison
 */
export function normalizePersian(text: string): string {
  if (!text) return '';

  let normalized = text.trim();

  // Remove diacritics & kashida
  normalized = normalized.replace(DIACRITICS_REGEX, '');
  normalized = normalized.replace(TATWEEL_REGEX, '');

  // Normalize Alef variants
  normalized = normalized.replace(/[آأإٱ]/g, 'ا');

  // Normalize Kaf
  normalized = normalized.replace(/ك/g, 'ک');

  // Normalize Yeh & Hamza forms
  normalized = normalized.replace(/[يىئ]/g, 'ی');

  // Normalize Heh with two dots
  normalized = normalized.replace(/ة/g, 'ه');

  // Normalize Waw with Hamza
  normalized = normalized.replace(/ؤ/g, 'و');

  // Remove Zero-Width Non-Joiner and Zero-Width Joiner
  normalized = normalized.replace(/[\u200C\u200D\u200B\uFEFF]/g, '');

  // Remove punctuation, numbers, symbols
  normalized = normalized.replace(PUNCTUATION_AND_SPECIALS, '');

  // Collapse multiple whitespaces
  normalized = normalized.replace(/\s+/g, '');

  return normalized;
}

/**
 * Normalizes a letter specifically for start/end comparison.
 * Maps 'آ' to 'ا', 'ي' to 'ی', etc.
 */
export function normalizeLetter(char: string): string {
  if (!char) return '';
  const norm = normalizePersian(char);
  return norm.charAt(0) || char;
}

/**
 * Gets the first Persian letter of a word (normalized).
 */
export function getFirstLetter(word: string): string {
  const normalized = normalizePersian(word);
  return normalized.charAt(0);
}

/**
 * Gets the last Persian letter of a word (normalized).
 * Accurately handles Persian Unicode ending characters like ه, ی, و, etc.
 */
export function getLastLetter(word: string): string {
  const normalized = normalizePersian(word);
  if (!normalized) return '';
  return normalized.charAt(normalized.length - 1);
}

/**
 * Checks whether two Persian letters match (e.g. 'آ' and 'ا' match, 'ی' and 'ي' match).
 */
export function areLettersMatching(letterA: string, letterB: string): boolean {
  if (!letterA || !letterB) return false;
  return normalizeLetter(letterA) === normalizeLetter(letterB);
}

/**
 * Checks if a string contains valid Persian characters only (at least 2 letters, no numbers).
 */
export function isValidPersianCharacters(word: string): boolean {
  const normalized = normalizePersian(word);
  if (normalized.length < 2) return false;

  // Regex allowing only valid Persian alphabet characters
  const persianRegex = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u067E\u0686\u0698\u06A9\u06AF\u06CC]+$/;
  return persianRegex.test(normalized);
}

/**
 * Returns a friendly Persian label for a letter (e.g., 'الف' for 'ا').
 */
export const PERSIAN_LETTER_NAMES: Record<string, string> = {
  'ا': 'الف',
  'ب': 'ب',
  'پ': 'پ',
  'ت': 'ت',
  'ث': 'ث',
  'ج': 'جیم',
  'چ': 'چ',
  'ح': 'حای حطی',
  'خ': 'خ',
  'د': 'دال',
  'ذ': 'ذال',
  'ر': 'ر',
  'ز': 'ز',
  'ژ': 'ژ',
  'س': 'سین',
  'ش': 'شین',
  'ص': 'صاد',
  'ض': 'ضاد',
  'ط': 'طا',
  'ظ': 'ظا',
  'ع': 'عین',
  'غ': 'غین',
  'ف': 'ف',
  'ق': 'قاف',
  'ک': 'کاف',
  'گ': 'گاف',
  'ل': 'لام',
  'م': 'میم',
  'ن': 'نون',
  'و': 'واو',
  'ه': 'هـ',
  'ی': 'ی'
};
