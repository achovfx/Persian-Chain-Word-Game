'use client';

import React from 'react';
import { Volume2, VolumeX, Settings, BookOpen, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenDictionary: () => void;
  onOpenTutorial: () => void;
  onOpenStats: () => void;
  onOpenProfile: () => void;
  userProfile?: { name: string; avatarEmoji: string; avatarTitle?: string };
  onReturnHome: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  roundNumber?: number;
  isInGame?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenDictionary,
  onOpenTutorial,
  onOpenStats,
  onOpenProfile,
  userProfile,
  onReturnHome,
  isSoundMuted,
  onToggleSound,
  roundNumber,
  isInGame
}) => {
  return (
    <header className="w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={onReturnHome}
          className="flex items-center gap-2.5 text-right group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all border border-cyan-400/30">
            <span className="text-xl font-black text-white select-none">ز</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                زنجیره کلمات
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <span className="hidden sm:block text-[11px] text-slate-400 font-medium -mt-0.5">
              بازی واژه‌سازی و مشاعره ایرانی
            </span>
          </div>
        </button>

        {/* Center Round Indicator if playing */}
        {isInGame && roundNumber !== undefined && (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-cyan-200 text-xs sm:text-sm font-semibold">
            <span>دور</span>
            <span className="font-mono text-cyan-400 font-bold text-sm sm:text-base">{roundNumber}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Profile Customization Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-slate-200 hover:text-white transition-all text-xs font-semibold shadow-sm hover:shadow-cyan-500/20 group"
            title="تغییر نام و انتخاب عکس پروفایل"
          >
            <span className="text-base sm:text-lg select-none group-hover:scale-110 transition-transform">
              {userProfile?.avatarEmoji || '🦁'}
            </span>
            <span className="max-w-[70px] sm:max-w-[100px] truncate text-cyan-200 font-bold hidden xs:inline">
              {userProfile?.name || 'پروفایل'}
            </span>
          </button>

          {/* Dictionary explorer */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenDictionary();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
            title="واژه‌نامه فارسی"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">واژه‌نامه</span>
          </button>

          {/* Tutorial / Help */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenTutorial();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
            title="راهنمای بازی"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">راهنما</span>
          </button>

          {/* Stats */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenStats();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
            title="آمار بازی‌ها"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">آمار</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 transition-all"
            title={isSoundMuted ? 'روشن کردن صدا' : 'قطع صدا'}
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 transition-all"
            title="تنظیمات"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
