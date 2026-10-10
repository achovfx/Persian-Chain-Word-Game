'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles, BookOpen } from 'lucide-react';
import { Player, WordHistoryItem } from '@/lib/game/gameEngine';
import { soundEffects } from '@/lib/audio/soundEffects';

interface VictoryModalProps {
  winner: Player;
  history: WordHistoryItem[];
  onPlayAgain: () => void;
  onReturnHome: () => void;
  onOpenDictionary: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  history,
  onPlayAgain,
  onReturnHome,
  onOpenDictionary
}) => {
  useEffect(() => {
    soundEffects.playVictory();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);

      return () => clearTimeout(timer);
    } catch {
      // Ignore if canvas not supported
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20 space-y-6"
      >
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10 fill-current" />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl animate-spin">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </span>
        </div>

        <div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/70 border border-amber-500/40 px-3.5 py-1 rounded-full">
            پایان مسابقه · قهرمان میدان
          </span>
          <h2 className="text-3xl font-black text-white mt-3">
            {winner.name} برنده شد!
          </h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            با ذکاوت و گستره واژگان عالی توانستید تمام حریفان را شکست دهید.
          </p>
        </div>

        {/* Match summary stats */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">کلمات متصل شده</span>
            <span className="text-xl font-black text-cyan-400 font-mono">
              {history.length}
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">کلمات قهرمان</span>
            <span className="text-xl font-black text-amber-400 font-mono">
              {winner.wordsSubmitted.length}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>بازی دوباره</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenDictionary();
              }}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>مشاهده واژه‌نامه</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onReturnHome();
              }}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>منوی اصلی</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
