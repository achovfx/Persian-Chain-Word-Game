'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Flame, BookOpen, Award, RotateCcw } from 'lucide-react';
import { MatchStats } from '@/lib/game/gameEngine';
import { soundEffects } from '@/lib/audio/soundEffects';

interface StatsModalProps {
  stats: MatchStats;
  onResetStats: () => void;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  onResetStats,
  onClose
}) => {
  const winRate = stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-amber-950/40 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">کارنامه و آمار بازی</h3>
              <p className="text-xs text-slate-400">ثبت دستاوردهای شما در زنجیره کلمات</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <span className="text-xs text-slate-400 block mb-0.5">تعداد پیروزی‌ها</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {stats.wins}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">از {stats.totalMatches} بازی</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <Flame className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
            <span className="text-xs text-slate-400 block mb-0.5">درصد برد</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ٪{winRate}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">ضریب موفقیت</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <BookOpen className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <span className="text-xs text-slate-400 block mb-0.5">کل کلمات صحیح</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {stats.totalWords}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">واژگان ثبت‌شده</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
            <span className="text-xs text-slate-400 block mb-0.5">طولانی‌ترین زنجیره</span>
            <span className="text-2xl font-black text-purple-400 font-mono">
              {stats.longestChain}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">کلمه در یک دست</span>
          </div>
        </div>

        {/* Reset and Close */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              if (window.confirm('آیا از بازنشانی آمار خود مطمئن هستید؟')) {
                onResetStats();
              }
            }}
            className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl border border-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پاک کردن آمار</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </div>
  );
};
