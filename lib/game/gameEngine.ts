/**
 * Central Game Engine for «زنجیره کلمات»
 * Manages turns, life counters, elimination, letter fairness, timer ticks,
 * AI turn orchestration, and local multiplayer pass-and-play states.
 */

import { persianDictionary, WordValidationResult } from '../persian/dictionary';
import { getLastLetter, normalizePersian, CHALLENGING_LETTERS, PERSIAN_ALPHABET } from '../persian/normalizer';
import { PersianWordEntry } from '../persian/vocabularyList';

export type GameMode =
  | 'SINGLE_PLAYER'
  | 'TWO_PLAYER'
  | 'FOUR_PLAYER'
  | 'SIX_PLAYER'
  | 'PRACTICE'
  | 'CHALLENGE';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isAI: boolean;
  lives: number;          // Exactly 3 hearts
  maxLives: number;
  wordsSubmitted: string[];
  isEliminated: boolean;
  score: number;
}

export interface WordHistoryItem {
  id: string;
  word: string;
  normalized: string;
  playerId: string;
  playerName: string;
  startLetter: string;
  endLetter: string;
  timestamp: number;
  entry?: PersianWordEntry;
}

export interface MatchSettings {
  turnTimeLimit: number;       // In seconds: 10, 15, 20, 30, 0 (untimed)
  aiDifficulty: AIDifficulty;
  passDevicePrivacy: boolean;  // Privacy shield between turns on shared device
  replaceDifficultLetters: boolean; // Auto-replace rare letters like ژ, ض, etc.
}

export interface MatchStats {
  totalMatches: number;
  wins: number;
  totalWords: number;
  longestChain: number;
  streak: number;
}

export interface GameState {
  mode: GameMode;
  settings: MatchSettings;
  status: 'MENU' | 'ROULETTE' | 'PLAYING' | 'PASS_DEVICE' | 'VICTORY';
  players: Player[];
  activePlayerIndex: number;
  currentLetter: string;
  usedNormalizedWords: Set<string>;
  wordHistory: WordHistoryItem[];
  remainingSeconds: number;
  roundNumber: number;
  winner: Player | null;
  lastFeedback: {
    type: 'success' | 'error' | 'info';
    message: string;
    details?: string;
  } | null;
}

// Avatars for Persian players
export const AVATAR_OPTIONS = ['🦁', '🦅', '🐆', '🐎', '🦉', '🦊', '🐬', '🦚', '🌹', '💎'];

export const DEFAULT_SETTINGS: MatchSettings = {
  turnTimeLimit: 15,
  aiDifficulty: 'MEDIUM',
  passDevicePrivacy: false,
  replaceDifficultLetters: false
};

export function createInitialPlayers(
  mode: GameMode,
  customNames?: string[],
  customAvatar?: string
): Player[] {
  if (mode === 'SINGLE_PLAYER') {
    return [
      {
        id: 'player_1',
        name: customNames?.[0] || 'شما',
        avatar: customAvatar || '🦁',
        isAI: false,
        lives: 3,
        maxLives: 3,
        wordsSubmitted: [],
        isEliminated: false,
        score: 0
      },
      {
        id: 'player_ai',
        name: 'هوش مصنوعی زانا',
        avatar: '🤖',
        isAI: true,
        lives: 3,
        maxLives: 3,
        wordsSubmitted: [],
        isEliminated: false,
        score: 0
      }
    ];
  }

  if (mode === 'PRACTICE' || mode === 'CHALLENGE') {
    return [
      {
        id: 'player_practice',
        name: customNames?.[0] || 'واژه‌ساز',
        avatar: customAvatar || '💎',
        isAI: false,
        lives: 3,
        maxLives: 3,
        wordsSubmitted: [],
        isEliminated: false,
        score: 0
      }
    ];
  }

  const counts: Record<string, number> = {
    TWO_PLAYER: 2,
    FOUR_PLAYER: 4,
    SIX_PLAYER: 6
  };
  const count = counts[mode] || 2;
  const defaultNames = ['بازیکن ۱', 'بازیکن ۲', 'بازیکن ۳', 'بازیکن ۴', 'بازیکن ۵', 'بازیکن ۶'];

  return Array.from({ length: count }, (_, i) => ({
    id: `player_${i + 1}`,
    name: customNames?.[i]?.trim() || defaultNames[i],
    avatar: i === 0 && customAvatar ? customAvatar : AVATAR_OPTIONS[i % AVATAR_OPTIONS.length],
    isAI: false,
    lives: 3,
    maxLives: 3,
    wordsSubmitted: [],
    isEliminated: false,
    score: 0
  }));
}

/**
 * Calculates next active player index (skipping eliminated players)
 */
export function getNextActivePlayerIndex(players: Player[], currentIndex: number): number {
  const activeCount = players.filter((p) => !p.isEliminated).length;
  if (activeCount <= 1) return currentIndex;

  let nextIdx = (currentIndex + 1) % players.length;
  while (players[nextIdx].isEliminated) {
    nextIdx = (nextIdx + 1) % players.length;
  }
  return nextIdx;
}

/**
 * Checks if the match has reached a winner condition
 */
export function checkWinner(players: Player[], mode: GameMode): Player | null {
  if (mode === 'PRACTICE' || mode === 'CHALLENGE') {
    return null; // Solo endless/practice mode
  }

  const alivePlayers = players.filter((p) => !p.isEliminated);
  if (alivePlayers.length === 1) {
    return alivePlayers[0];
  }
  return null;
}
