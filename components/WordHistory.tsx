'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { WordHistoryItem } from '@/lib/game/gameEngine';
import { PersianWordEntry } from '@/lib/persian/vocabularyList';

interface WordHistoryProps {
  history: WordHistoryItem[];
  onSelectWord: (entry: PersianWordEntry | WordHistoryItem) => void;
}

export const WordHistory: React.FC<WordHistoryProps> = ({
  history,
  onSelectWord
}) => {
  if (history.length === 0) {
    return (
      <div className="w-full py-8 px-4 rounded-2xl border border-slate-800 bg-slate-900/40 text-center backdrop-blur-sm">
        <Clock className="w-6 h-6 text-slate-500 mx-auto mb-2" />
        <p className="text-sm text-slate-400 font-medium">
          هنوز کلمه‌ای ثبت نشده است. اولین بازیکن زنجیره را آغاز می‌کند!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
          <span>زنجیره کلمات بازی</span>
          <span className="text-xs font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
            {history.length} واژه
          </span>
        </h3>
        <span className="text-[11px] text-slate-500">
          برای دیدن معنی روی هر کلمه بزنید
        </span>
      </div>

      {/* Horizontal scrolling ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scroll-smooth">
        {history.map((item, index) => {
          const isLatest = index === history.length - 1;

          return (
            <React.Fragment key={item.id}>
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => onSelectWord(item)}
                className={`group shrink-0 relative rounded-xl border px-3.5 py-2 text-right transition-all flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isLatest
                    ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                  <span className="font-semibold text-slate-300 truncate max-w-[85px]">
                    {item.playerName}
                  </span>
                  <BookOpen className="w-3 h-3 text-cyan-400/70 group-hover:text-cyan-400 ml-auto" />
                </div>

                <div className="flex items-center gap-1 text-base sm:text-lg font-black text-white">
                  {/* Highlight start letter */}
                  <span className="text-cyan-400 underline decoration-cyan-400/60 underline-offset-4">
                    {item.word.charAt(0)}
                  </span>
                  <span>{item.word.slice(1, -1)}</span>
                  {/* Highlight ending letter */}
                  <span className="text-amber-400 font-extrabold underline decoration-amber-400/80 underline-offset-4">
                    {item.word.slice(-1)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                  <span>
                    شروع: <strong className="text-cyan-300">{item.startLetter}</strong>
                  </span>
                  <span>
                    پایان: <strong className="text-amber-300">{item.endLetter}</strong>
                  </span>
                </div>
              </motion.button>

              {/* Arrow linking to next word */}
              {index < history.length - 1 && (
                <div className="shrink-0 text-cyan-500/60 flex items-center">
                  <ArrowLeft className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
