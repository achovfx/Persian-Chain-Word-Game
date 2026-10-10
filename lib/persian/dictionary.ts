/**
 * Persian Dictionary Engine
 * High-performance, expandable dictionary service with Trie/Set indexing,
 * letter grouping, strict validation, and difficulty-aware AI candidate selection.
 */

import {
  normalizePersian,
  getFirstLetter,
  getLastLetter,
  areLettersMatching,
  isValidPersianCharacters,
  CHALLENGING_LETTERS,
  PERSIAN_ALPHABET,
  PERSIAN_LETTER_NAMES,
  PersianLetter
} from './normalizer';
import {
  RAW_PERSIAN_WORDS,
  EXTENDED_PERSIAN_WORDS_BY_LETTER,
  PersianWordEntry
} from './vocabularyList';
import { MASSIVE_PERSIAN_ENTRIES } from './massiveLexicon';
import { UPLOADED_VOCABULARY_RAW } from './uploadedLexicon';
import {
  PERSIAN_NAMES_ENTRIES,
  PERSIAN_GEOGRAPHY_ENTRIES,
  EXPANDED_PERSIAN_WORDS
} from './persianNamesAndExpandedLexicon';

export interface WordValidationResult {
  isValid: boolean;
  normalizedWord: string;
  startLetter?: string;
  endLetter?: string;
  entry?: PersianWordEntry;
  errorReason?: 'TOO_SHORT' | 'INVALID_CHARACTERS' | 'WRONG_START_LETTER' | 'ALREADY_USED' | 'NOT_IN_DICTIONARY';
  errorMessage?: string;
}

class PersianDictionaryService {
  private normalizedWordSet: Set<string> = new Set();
  private entriesByNormalized: Map<string, PersianWordEntry> = new Map();
  private entriesByFirstLetter: Map<string, PersianWordEntry[]> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeDictionary();
  }

  private initializeDictionary() {
    if (this.isInitialized) return;

    // Initialize all alphabet buckets
    for (const letter of PERSIAN_ALPHABET) {
      this.entriesByFirstLetter.set(letter, []);
    }

    // 1. Process curated entries with metadata
    for (const item of RAW_PERSIAN_WORDS) {
      const norm = normalizePersian(item.w);
      if (!norm || norm.length < 2) continue;

      const firstL = getFirstLetter(norm);
      const entry: PersianWordEntry = {
        word: item.w,
        normalized: norm,
        meaning: item.m,
        category: item.c,
        difficulty: item.d,
        partOfSpeech: 'noun'
      };

      this.normalizedWordSet.add(norm);
      this.entriesByNormalized.set(norm, entry);

      const bucket = this.entriesByFirstLetter.get(firstL);
      if (bucket) {
        bucket.push(entry);
      } else {
        this.entriesByFirstLetter.set(firstL, [entry]);
      }
    }

    // 2. Process extended vocabulary by letter
    for (const [letter, wordList] of Object.entries(EXTENDED_PERSIAN_WORDS_BY_LETTER)) {
      const normLetter = normalizePersian(letter).charAt(0) || letter;
      const bucket = this.entriesByFirstLetter.get(normLetter) || [];

      for (const rawWord of wordList) {
        const norm = normalizePersian(rawWord);
        if (!norm || norm.length < 2) continue;

        if (!this.normalizedWordSet.has(norm)) {
          const entry: PersianWordEntry = {
            word: rawWord,
            normalized: norm,
            meaning: `واژه اصیل و معتبر در زبان فارسی`,
            category: 'فرهنگ و واژگان',
            difficulty: norm.length > 5 ? 'hard' : 'medium'
          };

          this.normalizedWordSet.add(norm);
          this.entriesByNormalized.set(norm, entry);
          bucket.push(entry);
        }
      }
      this.entriesByFirstLetter.set(normLetter, bucket);
    }

    // 3. Process massive expanded vocabulary entries with definitions
    for (const item of MASSIVE_PERSIAN_ENTRIES) {
      const norm = normalizePersian(item.w);
      if (!norm || norm.length < 2) continue;

      const firstL = getFirstLetter(norm);
      const entry: PersianWordEntry = {
        word: item.w,
        normalized: norm,
        meaning: item.m,
        category: item.c,
        difficulty: item.d,
        partOfSpeech: 'noun'
      };

      if (!this.normalizedWordSet.has(norm)) {
        this.normalizedWordSet.add(norm);
        this.entriesByNormalized.set(norm, entry);

        const bucket = this.entriesByFirstLetter.get(firstL);
        if (bucket) {
          bucket.push(entry);
        } else {
          this.entriesByFirstLetter.set(firstL, [entry]);
        }
      }
    }

    // 4. Process all words from uploaded dataset
    for (const rawWord of UPLOADED_VOCABULARY_RAW) {
      const norm = normalizePersian(rawWord);
      if (!norm || norm.length < 2) continue;

      const firstL = getFirstLetter(norm);
      if (!this.normalizedWordSet.has(norm)) {
        const entry: PersianWordEntry = {
          word: rawWord,
          normalized: norm,
          meaning: `واژه معتبر فارسی از بانک واژگان جامع`,
          category: 'واژگان عمومی و تخصصی',
          difficulty: norm.length > 5 ? 'hard' : norm.length <= 3 ? 'easy' : 'medium'
        };

        this.normalizedWordSet.add(norm);
        this.entriesByNormalized.set(norm, entry);

        const bucket = this.entriesByFirstLetter.get(firstL);
        if (bucket) {
          bucket.push(entry);
        } else {
          this.entriesByFirstLetter.set(firstL, [entry]);
        }
      }
    }

    // 5. Process authentic Persian names (اسامی اصیل فارسی و تاریخی)
    for (const item of PERSIAN_NAMES_ENTRIES) {
      const norm = normalizePersian(item.w);
      if (!norm || norm.length < 2) continue;

      const firstL = getFirstLetter(norm);
      const entry: PersianWordEntry = {
        word: item.w,
        normalized: norm,
        meaning: item.m,
        category: item.c,
        difficulty: item.d,
        partOfSpeech: 'noun'
      };

      if (!this.normalizedWordSet.has(norm)) {
        this.normalizedWordSet.add(norm);
        this.entriesByNormalized.set(norm, entry);

        const bucket = this.entriesByFirstLetter.get(firstL);
        if (bucket) {
          bucket.push(entry);
        } else {
          this.entriesByFirstLetter.set(firstL, [entry]);
        }
      }
    }

    // 6. Process Iranian and world geography names in Persian (جغرافیا و مکان‌ها)
    for (const item of PERSIAN_GEOGRAPHY_ENTRIES) {
      const norm = normalizePersian(item.w);
      if (!norm || norm.length < 2) continue;

      const firstL = getFirstLetter(norm);
      const entry: PersianWordEntry = {
        word: item.w,
        normalized: norm,
        meaning: item.m,
        category: item.c,
        difficulty: item.d,
        partOfSpeech: 'noun'
      };

      if (!this.normalizedWordSet.has(norm)) {
        this.normalizedWordSet.add(norm);
        this.entriesByNormalized.set(norm, entry);

        const bucket = this.entriesByFirstLetter.get(firstL);
        if (bucket) {
          bucket.push(entry);
        } else {
          this.entriesByFirstLetter.set(firstL, [entry]);
        }
      }
    }

    // 7. Process expanded Persian compound and literary words
    for (const rawWord of EXPANDED_PERSIAN_WORDS) {
      const norm = normalizePersian(rawWord);
      if (!norm || norm.length < 2) continue;

      const firstL = getFirstLetter(norm);
      if (!this.normalizedWordSet.has(norm)) {
        const entry: PersianWordEntry = {
          word: rawWord,
          normalized: norm,
          meaning: `واژه و ترکیب معتبر و مصطلح در زبان فارسی`,
          category: 'فرهنگ و واژگان',
          difficulty: norm.length > 5 ? 'hard' : norm.length <= 3 ? 'easy' : 'medium'
        };

        this.normalizedWordSet.add(norm);
        this.entriesByNormalized.set(norm, entry);

        const bucket = this.entriesByFirstLetter.get(firstL);
        if (bucket) {
          bucket.push(entry);
        } else {
          this.entriesByFirstLetter.set(firstL, [entry]);
        }
      }
    }

    this.isInitialized = true;
  }


  /**
   * Returns total count of verified Persian words in database.
   */
  public getWordCount(): number {
    return this.normalizedWordSet.size;
  }

  /**
   * Retrieves word metadata if present in dictionary.
   */
  public getWordEntry(rawOrNormalized: string): PersianWordEntry | undefined {
    const norm = normalizePersian(rawOrNormalized);
    return this.entriesByNormalized.get(norm);
  }

  /**
   * Retrieves all words starting with a specific Persian letter.
   */
  public getWordsByStartLetter(letter: string): PersianWordEntry[] {
    const normLetter = normalizePersian(letter).charAt(0);
    return this.entriesByFirstLetter.get(normLetter) || [];
  }

  /**
   * Checks if word is known in the verified dictionary.
   */
  public containsWord(rawWord: string): boolean {
    const norm = normalizePersian(rawWord);
    return this.normalizedWordSet.has(norm);
  }

  /**
   * Validates a word submission against game chain rules:
   * 1. Valid Persian characters and min length
   * 2. Starts with required letter
   * 3. Exists in verified Persian dictionary
   * 4. Has not already been used in current match
   */
  public validateSubmission(
    rawWord: string,
    requiredLetter: string,
    usedNormalizedWords: Set<string>
  ): WordValidationResult {
    const trimmed = rawWord ? rawWord.trim() : '';

    if (!trimmed || trimmed.length < 2) {
      return {
        isValid: false,
        normalizedWord: '',
        errorReason: 'TOO_SHORT',
        errorMessage: 'کلمه باید حداقل ۲ حرف داشته باشد.'
      };
    }

    if (!isValidPersianCharacters(trimmed)) {
      return {
        isValid: false,
        normalizedWord: normalizePersian(trimmed),
        errorReason: 'INVALID_CHARACTERS',
        errorMessage: 'فقط حروف معتبر زبان فارسی مجاز هستند.'
      };
    }

    const norm = normalizePersian(trimmed);
    const wordFirstLetter = getFirstLetter(norm);
    const wordEndLetter = getLastLetter(norm);

    // Check letter chain constraint
    if (!areLettersMatching(wordFirstLetter, requiredLetter)) {
      const requiredName = PERSIAN_LETTER_NAMES[requiredLetter] || requiredLetter;
      return {
        isValid: false,
        normalizedWord: norm,
        startLetter: wordFirstLetter,
        endLetter: wordEndLetter,
        errorReason: 'WRONG_START_LETTER',
        errorMessage: `کلمه باید با حرف «${requiredLetter}» (${requiredName}) شروع شود.`
      };
    }

    // Check duplicate usage
    if (usedNormalizedWords.has(norm)) {
      return {
        isValid: false,
        normalizedWord: norm,
        startLetter: wordFirstLetter,
        endLetter: wordEndLetter,
        errorReason: 'ALREADY_USED',
        errorMessage: 'این کلمه قبلاً در این مسابقه استفاده شده است!'
      };
    }

    // Check existence in dictionary
    if (!this.normalizedWordSet.has(norm)) {
      return {
        isValid: false,
        normalizedWord: norm,
        startLetter: wordFirstLetter,
        endLetter: wordEndLetter,
        errorReason: 'NOT_IN_DICTIONARY',
        errorMessage: 'این کلمه در واژه‌نامه بازی پیدا نشد؛ کلمه دیگری امتحان کن.'
      };
    }

    const entry = this.entriesByNormalized.get(norm);

    return {
      isValid: true,
      normalizedWord: norm,
      startLetter: wordFirstLetter,
      endLetter: wordEndLetter,
      entry
    };
  }

  /**
   * Generates a valid strategic Persian word for AI opponent based on difficulty.
   */
  public selectAIWord(
    requiredLetter: string,
    usedNormalizedWords: Set<string>,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  ): PersianWordEntry | null {
    const candidates = this.getWordsByStartLetter(requiredLetter).filter(
      (entry) => !usedNormalizedWords.has(entry.normalized)
    );

    if (candidates.length === 0) {
      return null; // Letter word pool depleted
    }

    if (difficulty === 'EASY') {
      // Pick shorter, easier words
      const easyWords = candidates.filter(
        (c) => c.difficulty === 'easy' || c.normalized.length <= 4
      );
      const pool = easyWords.length > 0 ? easyWords : candidates;
      const index = Math.floor(Math.random() * pool.length);
      return pool[index];
    }

    if (difficulty === 'MEDIUM') {
      // Balanced selection
      const mediumWords = candidates.filter(
        (c) => c.difficulty === 'medium' || c.difficulty === 'easy'
      );
      const pool = mediumWords.length > 0 ? mediumWords : candidates;
      const index = Math.floor(Math.random() * pool.length);
      return pool[index];
    }

    // HARD: Strategic play!
    // Try to pick words ending in challenging letters (like ژ, ث, ذ, ض, ظ, غ) to trap opponent,
    // or longer sophisticated vocabulary.
    const strategicWords = candidates.filter((c) => {
      const endL = getLastLetter(c.normalized);
      return CHALLENGING_LETTERS.has(endL) || c.difficulty === 'hard';
    });

    if (strategicWords.length > 0 && Math.random() < 0.75) {
      const index = Math.floor(Math.random() * strategicWords.length);
      return strategicWords[index];
    }

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
  }

  /**
   * Checks if an unused valid word exists for a given letter.
   */
  public hasAvailableWords(letter: string, usedNormalizedWords: Set<string>): boolean {
    const candidates = this.getWordsByStartLetter(letter);
    return candidates.some((c) => !usedNormalizedWords.has(c.normalized));
  }

  /**
   * Returns a random letter from the alphabet that has available unused words.
   */
  public getRandomAvailableLetter(
    usedNormalizedWords: Set<string>,
    excludeDifficult = false
  ): PersianLetter {
    const pool = PERSIAN_ALPHABET.filter((letter) => {
      if (excludeDifficult && CHALLENGING_LETTERS.has(letter)) {
        return false;
      }
      return this.hasAvailableWords(letter, usedNormalizedWords);
    });

    if (pool.length === 0) {
      // Fallback to any letter
      const idx = Math.floor(Math.random() * PERSIAN_ALPHABET.length);
      return PERSIAN_ALPHABET[idx];
    }

    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }
}

// Export singleton instance
export const persianDictionary = new PersianDictionaryService();
