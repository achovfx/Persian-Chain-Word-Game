'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSIAN_ALPHABET, PERSIAN_LETTER_NAMES } from '@/lib/persian/normalizer';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Sparkles } from 'lucide-react';

interface LetterRouletteProps {
  targetLetter: string;
  onComplete: () => void;
}

export const LetterRoulette: React.FC<LetterRouletteProps> = ({
  targetLetter,
  onComplete
}) => {
  const [currentDisplayLetter, setCurrentDisplayLetter] = useState('ا');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let spinCount = 0;
    const maxSpins = 24;
    let delay = 60;

    const spinInterval = () => {
      spinCount++;
      const randomIdx = Math.floor(Math.random() * PERSIAN_ALPHABET.length);
      setCurrentDisplayLetter(PERSIAN_ALPHABET[randomIdx]);
      soundEffects.playRouletteTick();

      if (spinCount < maxSpins) {
        // Progressively decelerate
        delay += 12;
        setTimeout(spinInterval, delay);
      } else {
        // Final landing
        setCurrentDisplayLetter(targetLetter);
        setIsRevealed(true);
        soundEffects.playLetterReveal();

        // Hold reveal before starting play
        setTimeout(() => {
          onComplete();
        }, 1600);
      }
    };

    const timer = setTimeout(spinInterval, 100);
    return () => clearTimeout(timer);
  }, [targetLetter, onComplete]);

  const letterName = PERSIAN_LETTER_NAMES[currentDisplayLetter] || currentDisplayLetter;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="text-sm font-semibold tracking-wide text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          چرخونه انتخاب حرف آغازین
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
          {isRevealed ? 'حرف شروع مشخص شد!' : 'در حال گردش حروف الفبا...'}
        </h2>
      </motion.div>

      {/* Glowing Letter Tile Container */}
      <div className="relative flex items-center justify-center p-8">
        {/* Radiant glow ring */}
        <motion.div
          animate={
            isRevealed
              ? {
                  scale: [1, 1.25, 1.15],
                  opacity: [0.4, 0.85, 0.6],
                  rotate: [0, 90, 180]
                }
              : { scale: 1, opacity: 0.3 }
          }
          transition={{ duration: 1.5, repeat: isRevealed ? Infinity : 0, repeatType: 'reverse' }}
          className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-indigo-500/30 to-fuchsia-500/30 blur-2xl"
        />

        {/* Central Card */}
        <motion.div
          animate={
            isRevealed
              ? { scale: [1, 1.12, 1.05], y: [0, -6, 0] }
              : { scale: [0.96, 1.02, 0.98] }
          }
          transition={
            isRevealed
              ? { duration: 0.6, ease: 'easeOut' }
              : { duration: 0.2, repeat: Infinity }
          }
          className={`relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-3xl border-2 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl transition-colors duration-300 ${
            isRevealed
              ? 'bg-gradient-to-b from-slate-900/90 to-indigo-950/90 border-cyan-400 shadow-cyan-500/40'
              : 'bg-slate-900/80 border-slate-700 shadow-indigo-950/50'
          }`}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentDisplayLetter}
              initial={{ scale: 0.8, opacity: 0.5, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              transition={{ duration: 0.08 }}
              className={`text-6xl sm:text-7xl font-black select-none ${
                isRevealed ? 'text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 via-white to-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]' : 'text-slate-200'
              }`}
            >
              {currentDisplayLetter}
            </motion.span>
          </AnimatePresence>

          <span className="mt-2 text-xs font-semibold text-cyan-300/80">
            {letterName}
          </span>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm sm:text-base text-slate-300 max-w-md font-medium"
      >
        {isRevealed ? (
          <span className="text-cyan-300 font-bold">
            اولین بازیکن باید کلمه‌ای بنویسد که با حرف «{currentDisplayLetter}» شروع شود.
          </span>
        ) : (
          'شانس با کدام حرف الفبا همراه خواهد بود؟'
        )}
      </motion.p>
    </div>
  );
};
