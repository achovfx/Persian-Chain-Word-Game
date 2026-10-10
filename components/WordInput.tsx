'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, CheckCircle2, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { normalizePersian, getFirstLetter, PERSIAN_LETTER_NAMES } from '@/lib/persian/normalizer';
import { soundEffects } from '@/lib/audio/soundEffects';

interface WordInputProps {
  requiredLetter: string;
  isAITurn: boolean;
  isInputDisabled?: boolean;
  liveDraft?: { playerName: string; word: string } | null;
  onDraftChange?: (word: string) => void;
  aiThinkingMessage?: string;
  aiTypingWord?: string;
  remainingSeconds: number;
  maxSeconds: number;
  onSubmitWord: (word: string) => void;
  onRerollLetter?: () => void;
  canRerollLetter?: boolean;
  feedback?: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
}

export const WordInput: React.FC<WordInputProps> = ({
  requiredLetter,
  isAITurn,
  isInputDisabled = false,
  liveDraft,
  onDraftChange,
  aiThinkingMessage,
  aiTypingWord,
  remainingSeconds,
  maxSeconds,
  onSubmitWord,
  onRerollLetter,
  canRerollLetter = false,
  feedback
}) => {
  const [inputWord, setInputWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!onDraftChange) return;
    const timer = setTimeout(() => onDraftChange(inputWord), 120);
    return () => clearTimeout(timer);
  }, [inputWord, onDraftChange]);

  // Focus input automatically on human turn
  useEffect(() => {
    if (!isAITurn) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAITurn, requiredLetter]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAITurn || isInputDisabled) return;

    const trimmed = inputWord.trim();
    if (!trimmed) return;

    soundEffects.playClick();
    onSubmitWord(trimmed);
    setInputWord('');
  };

  const letterName = PERSIAN_LETTER_NAMES[requiredLetter] || requiredLetter;
  const normalizedInput = normalizePersian(inputWord);
  const inputFirstLetter = getFirstLetter(normalizedInput);
  const isStartingLetterMatching = inputFirstLetter ? inputFirstLetter === normalizePersian(requiredLetter) : true;

  // Percentage for progress bar
  const timerPercentage = maxSeconds > 0 ? (remainingSeconds / maxSeconds) * 100 : 100;
  const isUrgent = maxSeconds > 0 && remainingSeconds <= 5;

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl shadow-cyan-950/20">
      {/* Central Starting Letter Prompt */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-300">
              <span className="text-3xl sm:text-4xl font-black text-white select-none">
                {requiredLetter}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400">حرف شروع الزامی:</span>
              <span className="text-xs bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-md font-bold">
                {letterName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              کلمه‌ای بنویس که با حرف «<strong className="text-cyan-300">{requiredLetter}</strong>» شروع شود
            </p>
          </div>
        </div>

        {/* Timer Bar or Skip Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {canRerollLetter && onRerollLetter && !isAITurn && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onRerollLetter();
              }}
              className="text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              title="تعویض حرف در صورت تمام شدن کلمات یا سختی بیش از حد"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تعویض حرف</span>
            </button>
          )}

          {maxSeconds > 0 && (
            <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-400">زمان:</span>
              <span
                className={`font-mono text-base font-black ${
                  isUrgent ? 'text-rose-400 animate-pulse' : 'text-cyan-300'
                }`}
              >
                {remainingSeconds} ثانیه
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar for Turn Timer */}
      {maxSeconds > 0 && (
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-5 border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isUrgent ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, timerPercentage))}%` }}
          />
        </div>
      )}

      {/* AI Turn Presentation */}
      {isAITurn ? (
        <div className="py-5 px-4 rounded-xl bg-slate-950/60 border border-cyan-500/30 flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <Bot className="w-5 h-5 text-cyan-400 animate-bounce" />
            <span>{aiThinkingMessage || 'هوش مصنوعی در حال تفکر است...'}</span>
          </div>

          {aiTypingWord ? (
            <div className="text-2xl font-black text-white tracking-wider flex items-center gap-1">
              <span>{aiTypingWord}</span>
              <span className="w-2 h-6 bg-cyan-400 animate-pulse inline-block" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping delay-100" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping delay-200" />
            </div>
          )}
        </div>
      ) : (
        /* Human Player Input Form */
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              disabled={isInputDisabled}
              placeholder={`کلمه‌ای با حرف «${requiredLetter}» بنویسید و دکمه را لمس کنید...`}
              className={`w-full bg-slate-950/80 text-white text-base sm:text-lg font-bold rounded-xl py-3.5 pr-4 pl-32 border transition-all focus:outline-none focus:ring-2 ${
                !isStartingLetterMatching && inputWord.length > 0
                  ? 'border-rose-500 focus:ring-rose-500/40'
                  : 'border-slate-700 focus:border-cyan-400 focus:ring-cyan-400/40'
              }`}
              dir="rtl"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            <button
              type="submit"
              disabled={isInputDisabled || !inputWord.trim()}
              className="absolute left-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>ثبت کلمه</span>
            </button>
          </div>

          {/* Letter mismatch immediate live warning */}
          {!isStartingLetterMatching && inputWord.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                توجه: این کلمه با «{inputFirstLetter}» شروع شده است، اما باید با «{requiredLetter}» شروع شود!
              </span>
            </div>
          )}
        </form>
      )}

      {liveDraft && (
        <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-4 py-3" aria-live="polite">
          <div className="text-xs font-semibold text-cyan-300">{liveDraft.playerName} در حال نوشتن است…</div>
          <div className="mt-1 min-h-7 text-lg font-bold text-white" dir="rtl">{liveDraft.word || '…'}<span className="ml-1 inline-block h-4 w-1 animate-pulse bg-cyan-400 align-middle" /></div>
        </div>
      )}

      {/* Turn Feedback Toasts */}
      {feedback && (
        <div
          className={`mt-4 p-3 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : feedback.type === 'error'
              ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};
