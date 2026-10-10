'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, LogOut, Sparkles, BookOpen, Clock, Heart, Bot, Flag, Share2, Award } from 'lucide-react';
import { Player, WordHistoryItem, MatchSettings, checkWinner, getNextActivePlayerIndex } from '@/lib/game/gameEngine';
import { PlayerCard } from './PlayerCard';
import { WordInput } from './WordInput';
import { WordHistory } from './WordHistory';
import { persianDictionary } from '@/lib/persian/dictionary';
import { planAIMove } from '@/lib/game/aiPlayer';
import { soundEffects } from '@/lib/audio/soundEffects';
import { getLastLetter, normalizePersian, CHALLENGING_LETTERS, PERSIAN_LETTER_NAMES } from '@/lib/persian/normalizer';
import { PersianWordEntry } from '@/lib/persian/vocabularyList';

interface GameBoardProps {
  players: Player[];
  currentLetter: string;
  settings: MatchSettings;
  roundNumber: number;
  usedNormalizedWords: Set<string>;
  wordHistory: WordHistoryItem[];
  onWordAccepted: (word: string, historyItem: WordHistoryItem, nextLetter: string) => void;
  onLifeLost: (playerId: string, reason: string) => void;
  onLetterChanged: (newLetter: string) => void;
  onPlayerEliminated: (playerId: string) => void;
  onGameOver: (winner: Player) => void;
  onRequirePassDevice: (nextPlayer: Player) => void;
  onRestartMatch: () => void;
  onExitMatch: () => void;
  onManualEndGame: () => void;
  onOpenDictionaryForWord: (word: string) => void;
  roomId?: string;
  onShareRoom?: () => void;
}


export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentLetter,
  settings,
  roundNumber,
  usedNormalizedWords,
  wordHistory,
  onWordAccepted,
  onLifeLost,
  onLetterChanged,
  onPlayerEliminated,
  onGameOver,
  onRequirePassDevice,
  onRestartMatch,
  onExitMatch,
  onManualEndGame,
  onOpenDictionaryForWord,
  roomId,
  onShareRoom
}) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.turnTimeLimit);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // AI turn state
  const [aiThinkingMessage, setAiThinkingMessage] = useState('');
  const [aiTypingWord, setAiTypingWord] = useState('');
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const turnTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activePlayer = players[activePlayerIndex];
  const isAITurn = activePlayer ? activePlayer.isAI : false;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    };
  }, []);

  // Check if match won
  const checkGameStatus = useCallback(
    (currentPlayers: Player[]) => {
      const winner = checkWinner(currentPlayers, 'TWO_PLAYER');
      if (winner) {
        onGameOver(winner);
        return true;
      }
      return false;
    },
    [onGameOver]
  );

  // Turn Timeout Handler
  const handleTimeout = useCallback(() => {
    if (!activePlayer || activePlayer.isEliminated) return;

    soundEffects.playHeartDamage();
    setFeedback({
      type: 'error',
      message: `زمان نوبت «${activePlayer.name}» تمام شد! یک جان از دست رفت.`
    });

    onLifeLost(activePlayer.id, 'اتمام زمان');

    // Check if player eliminated after life deduction
    const remainingLives = activePlayer.lives - 1;
    let updatedPlayers = [...players];
    if (remainingLives <= 0) {
      soundEffects.playElimination();
      onPlayerEliminated(activePlayer.id);
      updatedPlayers = players.map((p) =>
        p.id === activePlayer.id ? { ...p, lives: 0, isEliminated: true } : p
      );
    }

    if (checkGameStatus(updatedPlayers)) return;

    // Advance to next active player
    const nextIdx = getNextActivePlayerIndex(updatedPlayers, activePlayerIndex);
    setActivePlayerIndex(nextIdx);
    setRemainingSeconds(settings.turnTimeLimit);

    if (settings.passDevicePrivacy && !updatedPlayers[nextIdx].isAI) {
      onRequirePassDevice(updatedPlayers[nextIdx]);
    }
  }, [
    activePlayer,
    players,
    activePlayerIndex,
    settings.turnTimeLimit,
    settings.passDevicePrivacy,
    onLifeLost,
    onPlayerEliminated,
    checkGameStatus,
    onRequirePassDevice
  ]);

  // Turn countdown timer
  useEffect(() => {
    if (settings.turnTimeLimit <= 0 || isAITurn) return;

    if (turnTimerRef.current) clearInterval(turnTimerRef.current);

    turnTimerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (turnTimerRef.current) clearInterval(turnTimerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 5) {
          soundEffects.playTimerTick(true);
        } else {
          soundEffects.playTimerTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    };
  }, [activePlayerIndex, isAITurn, settings.turnTimeLimit, handleTimeout]);

  // Process valid word submission
  const handleValidWordSubmission = useCallback((word: string, entry: PersianWordEntry) => {
    soundEffects.playCorrectWord();
    const nextStartLetter = getLastLetter(word);

    const historyItem: WordHistoryItem = {
      id: `${Date.now()}_${Math.random()}`,
      word,
      normalized: normalizePersian(word),
      playerId: activePlayer.id,
      playerName: activePlayer.name,
      startLetter: currentLetter,
      endLetter: nextStartLetter,
      timestamp: Date.now(),
      entry
    };

    setFeedback({
      type: 'success',
      message: `آفرین! کلمه «${word}» ثبت شد. حرف بعدی: «${nextStartLetter}»`
    });

    onWordAccepted(word, historyItem, nextStartLetter);

    // Switch turn
    const nextIdx = getNextActivePlayerIndex(players, activePlayerIndex);
    setActivePlayerIndex(nextIdx);
    setRemainingSeconds(settings.turnTimeLimit);

    if (settings.passDevicePrivacy && !players[nextIdx].isAI) {
      onRequirePassDevice(players[nextIdx]);
    }
  }, [
    activePlayer,
    currentLetter,
    players,
    activePlayerIndex,
    settings.turnTimeLimit,
    settings.passDevicePrivacy,
    onWordAccepted,
    onRequirePassDevice
  ]);

  // AI Turn Orchestration
  useEffect(() => {
    if (!isAITurn || !activePlayer || activePlayer.isEliminated) return;

    const plan = planAIMove(
      currentLetter,
      usedNormalizedWords,
      settings.aiDifficulty
    );

    // Schedule banter and typing asynchronously
    aiTimerRef.current = setTimeout(() => {
      setAiThinkingMessage(plan.banter);
      setAiTypingWord('');

      if (!plan.wordEntry) {
        // No unused word exists for letter, replace letter fairly!
        const newLetter = persianDictionary.getRandomAvailableLetter(usedNormalizedWords);
        setFeedback({
          type: 'info',
          message: `کلمات باقیمانده برای حرف «${currentLetter}» تمام شد. حرف جدید: «${newLetter}»`
        });
        onLetterChanged(newLetter);
        return;
      }

      // Simulate character-by-character typing
      const wordText = plan.wordEntry.word;
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx++;
        setAiTypingWord(wordText.slice(0, charIdx));
        soundEffects.playRouletteTick();

        if (charIdx >= wordText.length) {
          clearInterval(typeInterval);

          // Submit AI word
          setTimeout(() => {
            handleValidWordSubmission(wordText, plan.wordEntry!);
          }, 400);
        }
      }, 90);
    }, plan.thinkingDurationMs);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [
    activePlayerIndex,
    currentLetter,
    isAITurn,
    activePlayer,
    settings.aiDifficulty,
    usedNormalizedWords,
    handleValidWordSubmission,
    onLetterChanged
  ]);


  // Submit Word by Human Player
  const handleHumanWordSubmit = (rawWord: string) => {
    const result = persianDictionary.validateSubmission(
      rawWord,
      currentLetter,
      usedNormalizedWords
    );

    if (result.isValid && result.entry) {
      handleValidWordSubmission(rawWord, result.entry);
    } else {
      // Invalid word submission -> Lose a life
      soundEffects.playErrorWord();
      soundEffects.playHeartDamage();

      setFeedback({
        type: 'error',
        message: result.errorMessage || 'کلمه نامعتبر است! یک جان از دست رفت.'
      });

      onLifeLost(activePlayer.id, result.errorMessage || 'کلمه نامعتبر');

      const remainingLives = activePlayer.lives - 1;
      let updatedPlayers = [...players];
      if (remainingLives <= 0) {
        soundEffects.playElimination();
        onPlayerEliminated(activePlayer.id);
        updatedPlayers = players.map((p) =>
          p.id === activePlayer.id ? { ...p, lives: 0, isEliminated: true } : p
        );
      }

      if (checkGameStatus(updatedPlayers)) return;

      // Switch turn to next alive player so game doesn't stall
      const nextIdx = getNextActivePlayerIndex(updatedPlayers, activePlayerIndex);
      setActivePlayerIndex(nextIdx);
      setRemainingSeconds(settings.turnTimeLimit);

      if (settings.passDevicePrivacy && !updatedPlayers[nextIdx].isAI) {
        onRequirePassDevice(updatedPlayers[nextIdx]);
      }
    }
  };

  // Reroll letter button (if challenged or letter empty)
  const handleRerollLetter = () => {
    const newLetter = persianDictionary.getRandomAvailableLetter(usedNormalizedWords);
    onLetterChanged(newLetter);
    setFeedback({
      type: 'info',
      message: `حرف بازی به «${newLetter}» تغییر کرد.`
    });
  };

  const letterName = PERSIAN_LETTER_NAMES[currentLetter] || currentLetter;
  const isChallengingLetter = CHALLENGING_LETTERS.has(currentLetter);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Match Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span>دور:</span>
            <span className="font-mono text-cyan-400 font-black">{roundNumber}</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>واژگان زنجیره:</span>
            <span className="font-mono text-cyan-400 font-bold">{wordHistory.length}</span>
          </div>
          {roomId && (
            <>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                <span>کد اتاق:</span>
                <span className="font-mono font-black tracking-wider text-cyan-400">{roomId}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {roomId && onShareRoom && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onShareRoom();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold transition-all shadow-sm"
              title="اشتراک و کپی لینک اتاق"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">لینک اتاق</span>
            </button>
          )}

          {/* Dedicated Manual End Game Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (
                window.confirm(
                  'آیا می‌خواهید این بازی را به‌صورت دستی به پایان برسانید و برنده را بر اساس امتیاز و تعداد جان‌های باقیمانده اعلام کنید؟'
                )
              ) {
                onManualEndGame();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all shadow-sm shadow-amber-950/40"
            title="پایان دستی بازی و اعلام نتیجه نهایی"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>پایان دستی بازی</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              if (window.confirm('آیا از شروع مجدد این مسابقه مطمئن هستید؟')) {
                onRestartMatch();
              }
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="شروع مجدد مسابقه"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              if (window.confirm('آیا قصد خروج از بازی و بازگشت به منوی اصلی را دارید؟')) {
                onExitMatch();
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="خروج از بازی"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Players Scoreboard Grid */}
      <div
        className={`grid gap-3 ${
          players.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : players.length === 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : players.length === 6
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
            : 'grid-cols-1'
        }`}
      >
        {players.map((p, idx) => (
          <PlayerCard
            key={p.id}
            player={p}
            isActive={idx === activePlayerIndex}
            isCompact={players.length > 2}
          />
        ))}
      </div>

      {/* Central Input and Action Zone */}
      <WordInput
        requiredLetter={currentLetter}
        isAITurn={isAITurn}
        aiThinkingMessage={aiThinkingMessage}
        aiTypingWord={aiTypingWord}
        remainingSeconds={remainingSeconds}
        maxSeconds={settings.turnTimeLimit}
        onSubmitWord={handleHumanWordSubmit}
        onRerollLetter={handleRerollLetter}
        canRerollLetter={isChallengingLetter}
        feedback={feedback}
      />

      {/* Word History Ribbon */}
      <WordHistory
        history={wordHistory}
        onSelectWord={(item) => onOpenDictionaryForWord(item.word)}
      />
    </div>
  );
};
