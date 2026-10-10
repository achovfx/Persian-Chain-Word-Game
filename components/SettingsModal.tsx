'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Clock, Cpu, Shield, Sparkles } from 'lucide-react';
import { MatchSettings, AIDifficulty } from '@/lib/game/gameEngine';
import { soundEffects } from '@/lib/audio/soundEffects';

interface SettingsModalProps {
  settings: MatchSettings;
  onUpdateSettings: (newSettings: MatchSettings) => void;
  onClose: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  isSoundMuted,
  onToggleSound
}) => {
  const timeOptions = [
    { label: '۱۰ ثانیه (سریع)', value: 10 },
    { label: '۱۵ ثانیه (استاندارد)', value: 15 },
    { label: '۲۰ ثانیه (آرام)', value: 20 },
    { label: '۳۰ ثانیه (فکری)', value: 30 },
    { label: 'نامحدود (آموزشی)', value: 0 }
  ];

  const difficultyOptions: Array<{ label: string; value: AIDifficulty; desc: string }> = [
    { label: 'آسان', value: 'EASY', desc: 'کلمات پرکاربرد و روزمره' },
    { label: 'متوسط', value: 'MEDIUM', desc: 'دایره لغات گسترده و هوشمند' },
    { label: 'سخت', value: 'HARD', desc: 'استراتژی دام‌گذاری و لغات چالشی' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">تنظیمات بازی</h3>
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

        {/* Turn Timer Setting */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>مدت زمان هر نوبت</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {timeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onUpdateSettings({ ...settings, turnTimeLimit: opt.value });
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-right transition-all ${
                  settings.turnTimeLimit === opt.value
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Difficulty Setting */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>سطح هوش مصنوعی در بازی تک‌نفره</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {difficultyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onUpdateSettings({ ...settings, aiDifficulty: opt.value });
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  settings.aiDifficulty === opt.value
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-xs font-bold">{opt.label}</span>
                <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sound & Audio switch */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isSoundMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <span className="text-xs font-bold text-white block">افکت‌های صوتی</span>
              <span className="text-[11px] text-slate-400">صداهای چرخونه، ثبت کلمه و تیک‌تاک ساعت</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onToggleSound();
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              !isSoundMuted ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                !isSoundMuted ? 'translate-x-0' : '-translate-x-6'
              }`}
            />
          </button>
        </div>

        {/* Pass Device Privacy Switch */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">صفحه حریم خصوصی نوبت</span>
              <span className="text-[11px] text-slate-400">نمایش پرده بین نوبت بازیکنان در یک دستگاه</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onUpdateSettings({
                ...settings,
                passDevicePrivacy: !settings.passDevicePrivacy
              });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.passDevicePrivacy ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.passDevicePrivacy ? 'translate-x-0' : '-translate-x-6'
              }`}
            />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-colors"
        >
          ذخیره و بازگشت
        </button>
      </motion.div>
    </div>
  );
};
