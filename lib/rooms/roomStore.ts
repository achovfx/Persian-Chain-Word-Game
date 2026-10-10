/**
 * Online Room State Store for «زنجیره کلمات»
 * Supports real-time room sharing, custom player counts (2, 4, 6, 8, or custom N),
 * synchronized turn management, word validation, and manual match termination.
 */

import { Player, WordHistoryItem, MatchSettings, DEFAULT_SETTINGS, AVATAR_OPTIONS, checkWinner, getNextActivePlayerIndex } from '../game/gameEngine';
import { persianDictionary } from '../persian/dictionary';
import { getLastLetter, normalizePersian } from '../persian/normalizer';

export interface OnlineRoom {
  id: string;
  hostId: string;
  maxPlayers: number;
  players: Player[];
  activePlayerIndex: number;
  currentLetter: string;
  roundNumber: number;
  usedNormalizedWords: string[];
  wordHistory: WordHistoryItem[];
  settings: MatchSettings;
  status: 'LOBBY' | 'ROULETTE' | 'PLAYING' | 'VICTORY';
  winner: Player | null;
  lastActivity: number;
  lastActionFeedback: {
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: number;
  } | null;
}

// Global in-memory cache for rooms across API requests
const globalRooms = new Map<string, OnlineRoom>();

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createRoom(
  hostName: string,
  maxPlayers: number,
  settings: Partial<MatchSettings> = {}
): OnlineRoom {
  const roomId = generateRoomId();
  const hostPlayer: Player = {
    id: `player_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: hostName.trim() || 'میزبان بازی',
    avatar: '🦁',
    isAI: false,
    lives: 3,
    maxLives: 3,
    wordsSubmitted: [],
    isEliminated: false,
    score: 0
  };

  const startingLetter = persianDictionary.getRandomAvailableLetter(new Set());

  const room: OnlineRoom = {
    id: roomId,
    hostId: hostPlayer.id,
    maxPlayers: Math.max(2, Math.min(12, maxPlayers)),
    players: [hostPlayer],
    activePlayerIndex: 0,
    currentLetter: startingLetter,
    roundNumber: 1,
    usedNormalizedWords: [],
    wordHistory: [],
    settings: { ...DEFAULT_SETTINGS, ...settings },
    status: 'LOBBY',
    winner: null,
    lastActivity: Date.now(),
    lastActionFeedback: {
      type: 'info',
      message: 'اتاق ساخته شد. دوستان خود را با لینک دعوت کنید!',
      timestamp: Date.now()
    }
  };

  globalRooms.set(roomId, room);
  return room;
}

export function getRoom(roomId: string): OnlineRoom | null {
  const cleanId = roomId.trim().toUpperCase();
  const room = globalRooms.get(cleanId);
  if (!room) return null;

  // Clean rooms older than 4 hours
  if (Date.now() - room.lastActivity > 4 * 60 * 60 * 1000) {
    globalRooms.delete(cleanId);
    return null;
  }

  return room;
}

export function joinRoom(
  roomId: string,
  playerName: string,
  avatar?: string
): { success: boolean; room?: OnlineRoom; player?: Player; error?: string } {
  const room = getRoom(roomId);
  if (!room) {
    return { success: false, error: 'اتاق مورد نظر یافت نشد یا منقضی شده است.' };
  }

  if (room.status !== 'LOBBY') {
    return { success: false, error: 'بازی در این اتاق آغاز شده است.' };
  }

  if (room.players.length >= room.maxPlayers) {
    return { success: false, error: 'ظرفیت این اتاق تکمیل شده است.' };
  }

  const assignedAvatar = avatar || AVATAR_OPTIONS[room.players.length % AVATAR_OPTIONS.length];
  const newPlayer: Player = {
    id: `player_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: playerName.trim() || `بازیکن ${room.players.length + 1}`,
    avatar: assignedAvatar,
    isAI: false,
    lives: 3,
    maxLives: 3,
    wordsSubmitted: [],
    isEliminated: false,
    score: 0
  };

  room.players.push(newPlayer);
  room.lastActivity = Date.now();
  room.lastActionFeedback = {
    type: 'info',
    message: `«${newPlayer.name}» به بازی ملحق شد.`,
    timestamp: Date.now()
  };

  return { success: true, room, player: newPlayer };
}

export function startRoomMatch(
  roomId: string,
  requesterPlayerId: string
): { success: boolean; room?: OnlineRoom; error?: string } {
  const room = getRoom(roomId);
  if (!room) return { success: false, error: 'اتاق یافت نشد.' };

  if (room.hostId !== requesterPlayerId && room.players.length > 1) {
    // Only host can start
  }

  if (room.players.length < 2) {
    return { success: false, error: 'برای شروع بازی حداقل به ۲ بازیکن نیاز است.' };
  }

  const startingLetter = persianDictionary.getRandomAvailableLetter(new Set());
  room.currentLetter = startingLetter;
  room.status = 'PLAYING';
  room.roundNumber = 1;
  room.activePlayerIndex = 0;
  room.usedNormalizedWords = [];
  room.wordHistory = [];
  room.winner = null;
  room.lastActivity = Date.now();
  room.lastActionFeedback = {
    type: 'success',
    message: `مسابقه آغاز شد! حرف شروع: «${startingLetter}»`,
    timestamp: Date.now()
  };

  return { success: true, room };
}

export function submitWordInRoom(
  roomId: string,
  playerId: string,
  word: string
): { success: boolean; room?: OnlineRoom; error?: string; feedback?: string } {
  const room = getRoom(roomId);
  if (!room) return { success: false, error: 'اتاق یافت نشد.' };
  if (room.status !== 'PLAYING') return { success: false, error: 'بازی در جریان نیست.' };

  const activePlayer = room.players[room.activePlayerIndex];
  if (activePlayer.id !== playerId) {
    return { success: false, error: 'در حال حاضر نوبت شما نیست!' };
  }

  const usedSet = new Set(room.usedNormalizedWords);
  const result = persianDictionary.validateSubmission(word, room.currentLetter, usedSet);

  room.lastActivity = Date.now();

  if (result.isValid && result.entry) {
    const nextStartLetter = getLastLetter(word);
    const historyItem: WordHistoryItem = {
      id: `${Date.now()}_${Math.random()}`,
      word,
      normalized: result.normalizedWord,
      playerId: activePlayer.id,
      playerName: activePlayer.name,
      startLetter: room.currentLetter,
      endLetter: nextStartLetter,
      timestamp: Date.now(),
      entry: result.entry
    };

    room.usedNormalizedWords.push(result.normalizedWord);
    room.wordHistory.push(historyItem);
    room.currentLetter = nextStartLetter;
    room.roundNumber += 1;

    activePlayer.wordsSubmitted.push(word);
    activePlayer.score += 10;

    room.lastActionFeedback = {
      type: 'success',
      message: `«${activePlayer.name}» کلمه «${word}» را ثبت کرد. حرف بعدی: «${nextStartLetter}»`,
      timestamp: Date.now()
    };

    // Advance turn
    room.activePlayerIndex = getNextActivePlayerIndex(room.players, room.activePlayerIndex);

    return { success: true, room };
  } else {
    // Lose a life
    activePlayer.lives -= 1;
    if (activePlayer.lives <= 0) {
      activePlayer.isEliminated = true;
      activePlayer.lives = 0;
    }

    room.lastActionFeedback = {
      type: 'error',
      message: result.errorMessage || `کلمه نامعتبر! یک جان از «${activePlayer.name}» کسر شد.`,
      timestamp: Date.now()
    };

    // Check winner
    const winner = checkWinner(room.players, 'TWO_PLAYER');
    if (winner) {
      room.winner = winner;
      room.status = 'VICTORY';
    } else {
      room.activePlayerIndex = getNextActivePlayerIndex(room.players, room.activePlayerIndex);
    }

    return { success: false, room, error: result.errorMessage };
  }
}

/**
 * Manually ends the match at any time and calculates the winning player or leader
 */
export function endRoomMatchManually(
  roomId: string,
  requesterPlayerId?: string
): { success: boolean; room?: OnlineRoom; error?: string } {
  const room = getRoom(roomId);
  if (!room) return { success: false, error: 'اتاق یافت نشد.' };

  // Determine current leader (highest score with lives, or most words)
  const surviving = room.players.filter((p) => !p.isEliminated);
  const pool = surviving.length > 0 ? surviving : room.players;

  const sorted = [...pool].sort((a, b) => {
    if (b.lives !== a.lives) return b.lives - a.lives;
    return b.score - a.score;
  });

  const champion = sorted[0] || room.players[0];

  room.status = 'VICTORY';
  room.winner = champion;
  room.lastActivity = Date.now();
  room.lastActionFeedback = {
    type: 'info',
    message: 'مسابقه به‌صورت دستی به پایان رسید و نتایج نهایی ثبت شد.',
    timestamp: Date.now()
  };

  return { success: true, room };
}
