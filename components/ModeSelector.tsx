'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Users, UserCheck, Flame, BookOpen, Sparkles, Play, ShieldAlert, Award, Globe, Link2, LogIn, Plus, User, Edit3 } from 'lucide-react';
import { GameMode, AIDifficulty } from '@/lib/game/gameEngine';
import { soundEffects } from '@/lib/audio/soundEffects';

interface ModeSelectorProps {
  onStartGame: (mode: GameMode, playerNames: string[], aiDifficulty: AIDifficulty) => void;
  onOpenDictionary: () => void;
  onOpenTutorial: () => void;
  onOpenOnlineRoom: (presetPlayers?: number) => void;
  onJoinOnlineRoom: () => void;
  onOpenProfile?: () => void;
  userProfile?: { name: string; avatarEmoji: string; avatarTitle?: string };
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  onStartGame,
  onOpenDictionary,
  onOpenTutorial,
  onOpenOnlineRoom,
  onJoinOnlineRoom,
  onOpenProfile,
  userProfile
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('SINGLE_PLAYER');
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('MEDIUM');
  const [playerNames, setPlayerNames] = useState<string[]>([
    'آرش', 'نیلوفر', 'سهراب', 'پروانه', 'بهرام', 'شیرین'
  ]);
  const [isConfiguringPlayers, setIsConfiguringPlayers] = useState(false);

  const modeCards: Array<{
    mode: GameMode;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badge: string;
    gradient: string;
    playerCount: number;
  }> = [
    {
      mode: 'SINGLE_PLAYER',
      title: 'تک‌نفره با هوش مصنوعی',
      subtitle: 'مسابقه چالشی با ربات سخنگو در ۳ سطح هوش',
      icon: Bot,
      badge: 'محبوب‌ترین',
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/40',
      playerCount: 1
    },
    {
      mode: 'TWO_PLAYER',
      title: 'دو نفره در یک دستگاه',
      subtitle: 'رقابت حماسی رو در رو با دوست یا همکار',
      icon: UserCheck,
      badge: 'دوئل تن‌به‌تن',
      gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent border-indigo-500/40',
      playerCount: 2
    },
    {
      mode: 'FOUR_PLAYER',
      title: 'چهار نفره گروهی',
      subtitle: 'هیجان دورهمی خانوادگی با جدول نوبت‌های زنده',
      icon: Users,
      badge: 'دورهمی',
      gradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent border-fuchsia-500/40',
      playerCount: 4
    },
    {
      mode: 'SIX_PLAYER',
      title: 'شش نفره حماسی',
      subtitle: 'شلوغ‌ترین و هیجان‌انگیزترین نبرد واژه‌سازی',
      icon: Users,
      badge: 'حداکثر ظرفیت',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/40',
      playerCount: 6
    },
    {
      mode: 'PRACTICE',
      title: 'حالت تمرینی و یادگیری',
      subtitle: 'واژه‌سازی آزادانه بدون استرس زمان و باخت',
      icon: BookOpen,
      badge: 'آموزشی',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40',
      playerCount: 1
    },
    {
      mode: 'CHALLENGE',
      title: 'چالش حروف نادر و سخت',
      subtitle: 'آزمایش تسلط روی حروف ژ، ث، ذ، ض، ظ، غ',
      icon: Flame,
      badge: 'فوق‌حرفه‌ای',
      gradient: 'from-rose-500/20 via-red-500/10 to-transparent border-rose-500/40',
      playerCount: 1
    }
  ];

  const handleLaunchGame = () => {
    soundEffects.playClick();
    const count = modeCards.find((c) => c.mode === selectedMode)?.playerCount || 1;
    const activeNames = playerNames.slice(0, count);
    onStartGame(selectedMode, activeNames, aiDifficulty);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>نسخه رسمی و کامل «زنجیره کلمات»</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          مسابقه هیجان‌انگیز <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">واژه‌سازی فارسی</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
          حرف آخر کلمه نفر قبل، حرف اول کلمه توست! هر بازیکن ۳ جان دارد و آخرین بازمانده برنده مسابقه خواهد شد.
        </p>

        {/* Player Profile Quick Customization Bar */}
        {onOpenProfile && (
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenProfile();
              }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-950/40 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 border border-white/20 flex items-center justify-center text-xl shadow group-hover:scale-105 transition-transform">
                <span>{userProfile?.avatarEmoji || '🦁'}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <span>پروفایل شما:</span>
                  <span className="text-cyan-300 font-bold">{userProfile?.name || 'قهرمان واژه‌ها'}</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 group-hover:text-cyan-300">
                  <Edit3 className="w-3 h-3" />
                  <span>تغییر نام و انتخاب عکس</span>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Online Multiplayer Banner with Link Sharing & Custom Count */}
      <div className="relative mb-8 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-cyan-950/80 via-blue-950/60 to-slate-900/90 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black">
              <Globe className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>قابلیت آنلاین زنده</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>بازی آنلاین با لینک دعوت</span>
              <span className="text-cyan-400 text-sm font-semibold">(۲، ۴، ۶، ۸ نفره یا تعداد دلخواه)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              یک اتاق آنلاین بسازید، لینک آن را به دوستانتان بفرستید تا هر کس با گوشی یا سیستم خودش وارد بازی شود. همچنین می‌توانید تعداد دلخواه بازیکنان را تعیین کنید!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenOnlineRoom();
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <Link2 className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
              <span>ساخت اتاق آنلاین جدید</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onJoinOnlineRoom();
              }}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>ورود با کد یا لینک</span>
            </button>
          </div>
        </div>

        {/* Quick Online Presets */}
        <div className="mt-4 pt-4 border-t border-cyan-500/20 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 ml-1">دسترسی سریع به اتاق آنلاین:</span>
          {[2, 4, 6, 8].map((count) => (
            <button
              key={count}
              onClick={() => {
                soundEffects.playClick();
                onOpenOnlineRoom(count);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-200 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{count} نفره آنلاین</span>
            </button>
          ))}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenOnlineRoom(0);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>تعداد دلخواه بازیکنان...</span>
          </button>
        </div>
      </div>

      {/* Mode Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {modeCards.map((card) => {
          const isSelected = selectedMode === card.mode;
          const IconComponent = card.icon;

          return (
            <motion.button
              key={card.mode}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEffects.playClick();
                setSelectedMode(card.mode);
              }}
              className={`relative rounded-3xl p-5 sm:p-6 text-right border transition-all flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-b ${card.gradient} bg-slate-900/90 shadow-xl shadow-cyan-500/10 border-cyan-400`
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mb-1.5">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{card.subtitle}</p>
              </div>

              {isSelected && (
                <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span>انتخاب شده</span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Mode Configuration Panel */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-md max-w-2xl mx-auto space-y-6">
        {selectedMode === 'SINGLE_PLAYER' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 block">
              سطح هوش مصنوعی رقیب:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map((level) => {
                const labels: Record<AIDifficulty, { title: string; desc: string }> = {
                  EASY: { title: 'آسان', desc: 'لغات ساده روزمره' },
                  MEDIUM: { title: 'متوسط', desc: 'لغات هوشمند و گسترده' },
                  HARD: { title: 'سخت', desc: 'استراتژی و لغات چالشی' }
                };
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setAIDifficulty(level);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      aiDifficulty === level
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{labels[level].title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{labels[level].desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Name Customization Toggle */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setIsConfiguringPlayers(!isConfiguringPlayers);
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
          >
            {isConfiguringPlayers ? 'پنهان کردن ویرایش اسامی بازیکنان' : 'ویرایش نام بازیکنان مسابقه'}
          </button>
        </div>

        {/* Dynamic Name Inputs if expanded */}
        {isConfiguringPlayers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {playerNames.slice(0, modeCards.find((c) => c.mode === selectedMode)?.playerCount || 1).map((name, i) => (
              <div key={i} className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  بازیکن {i + 1}:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const updated = [...playerNames];
                    updated[i] = e.target.value;
                    setPlayerNames(updated);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                  dir="rtl"
                />
              </div>
            ))}
          </div>
        )}

        {/* Primary CTA Button */}
        <button
          onClick={handleLaunchGame}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl text-base sm:text-lg shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
        >
          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          <span>شروع مسابقه زنجیره کلمات</span>
        </button>
      </div>
    </div>
  );
};
