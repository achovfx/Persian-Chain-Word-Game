'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Play } from 'lucide-react';
import { Player } from '@/lib/game/gameEngine';
import { soundEffects } from '@/lib/audio/soundEffects';

interface PassDeviceModalProps {
  nextPlayer: Player;
  onReady: () => void;
}

export const PassDeviceModal: React.FC<PassDeviceModalProps> = ({
  nextPlayer,
  onReady
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-cyan-950/50 space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
          <Shield className="w-8 h-8 text-cyan-400" />
        </div>

        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
            صفحه حفظ حریم نوبت
          </span>
          <h3 className="text-2xl font-black text-white mt-3">
            دستگاه را به {nextPlayer.name} تحویل دهید
          </h3>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            اطلاعات نوبت قبلی برای حفظ رقابت پنهان شده است. پس از آماده شدن، دکمه را لمس کنید.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-center gap-3">
          <span className="text-3xl">{nextPlayer.avatar}</span>
          <div className="text-right">
            <h4 className="text-base font-bold text-white">{nextPlayer.name}</h4>
            <span className="text-xs text-rose-400 font-semibold">{nextPlayer.lives} جان باقیمانده</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onReady();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-base shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>من آماده‌ام! نوبت من رو شروع کن</span>
        </button>
      </motion.div>
    </div>
  );
};
