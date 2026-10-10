/**
 * AI Opponent System for «زنجیره کلمات»
 * Generates natural Persian conversational banter, simulates realistic human typing,
 * and chooses strategic words using the verified Persian dictionary.
 */

import { persianDictionary } from '../persian/dictionary';
import { PersianWordEntry } from '../persian/vocabularyList';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

// Contextual Persian banter messages for AI opponent turns
export const AI_THINKING_MESSAGES = [
  'دارم به یک کلمه فکر می‌کنم...',
  'اممم... بذار ببینم چی تو آستین دارم...',
  'عجب حرف جالبی انداختی وسط!',
  'الان نوبت هوش مصنوعیه...',
  'دارم حافظه لغاتم رو جستجو می‌کنم...',
  'صبر کن ببینم چه واژه‌ای مناسبه...'
];

export const AI_SUCCESS_BANTER = [
  'این یکی رو داشته باش!',
  'حالا ببینم با حرف بعدی چه می‌کنی!',
  'یه کلمه اصیل و زیبا برای تو!',
  'نوبت توست، ببینم چیکار می‌کنی!',
  'اینم از پاسخ هوشمندانه من!',
  'پاسخ آماده شد، حالا نوبت توئه!'
];

export const AI_STRUGGLE_MESSAGES = [
  'وای، عجب حرف سختیه!',
  'پیدا کردن کلمه با این حرف کار آسونی نیست!',
  'نزدیک بود وقتم تموم بشه...'
];

export interface AIMovePlan {
  wordEntry: PersianWordEntry | null;
  word: string;
  banter: string;
  thinkingDurationMs: number;
}

export function planAIMove(
  currentLetter: string,
  usedNormalizedWords: Set<string>,
  difficulty: AIDifficulty
): AIMovePlan {
  const wordEntry = persianDictionary.selectAIWord(
    currentLetter,
    usedNormalizedWords,
    difficulty
  );

  let thinkingDurationMs = 1500;
  if (difficulty === 'EASY') {
    thinkingDurationMs = 1800 + Math.random() * 1200;
  } else if (difficulty === 'MEDIUM') {
    thinkingDurationMs = 1200 + Math.random() * 800;
  } else {
    // Hard
    thinkingDurationMs = 800 + Math.random() * 600;
  }

  let banter: string;
  if (!wordEntry) {
    banter = 'واژه‌ای در این دسته پیدا نشد، باید از قانون حروف چالش‌برانگیز استفاده کنیم!';
  } else if (Math.random() < 0.6) {
    const pool = AI_SUCCESS_BANTER;
    banter = pool[Math.floor(Math.random() * pool.length)];
  } else {
    const pool = AI_THINKING_MESSAGES;
    banter = pool[Math.floor(Math.random() * pool.length)];
  }

  return {
    wordEntry,
    word: wordEntry ? wordEntry.word : '',
    banter,
    thinkingDurationMs
  };
}
