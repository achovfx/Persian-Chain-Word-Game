'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Sparkles,
  Check,
  Shuffle,
  Shield,
  Heart,
  Award,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  UserProfile,
  AVATAR_CATALOG,
  AvatarOption,
  SUGGESTED_NAMES,
  saveUserProfile,
  getRandomProfile
} from '@/lib/profile/profileStore';
import { soundEffects } from '@/lib/audio/soundEffects';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onProfileUpdated
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentProfile.avatarId);
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state if modal reopens with new profile
  React.useEffect(() => {
    setName(currentProfile.name);
    setSelectedAvatarId(currentProfile.avatarId);
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const selectedAvatar: AvatarOption =
    AVATAR_CATALOG.find((a) => a.id === selectedAvatarId) || AVATAR_CATALOG[0];

  const categories = [
    'همه',
    'اساطیری و باستانی',
    'حیوانات و نمادها',
    'شخصیت‌ها و مشاهیر',
    'نشان‌ها و فانتزی'
  ];

  const filteredAvatars =
    selectedCategory === 'همه'
      ? AVATAR_CATALOG
      : AVATAR_CATALOG.filter((a) => a.category === selectedCategory);

  const handleRandomizeName = () => {
    soundEffects.playClick();
    const randomName = SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
    setName(randomName);
  };

  const handleRandomizeAll = () => {
    soundEffects.playClick();
    const random = getRandomProfile();
    setName(random.name);
    setSelectedAvatarId(random.avatarId);
  };

  const handleSelectAvatar = (avatar: AvatarOption) => {
    soundEffects.playClick();
    setSelectedAvatarId(avatar.id);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const finalName = trimmedName.length >= 2 ? trimmedName : 'قهرمان واژه‌ها';

    const updated: UserProfile = {
      name: finalName,
      avatarId: selectedAvatar.id,
      avatarEmoji: selectedAvatar.emoji,
      avatarTitle: selectedAvatar.title,
      badgeColor: selectedAvatar.badgeColor,
      gradient: selectedAvatar.gradient,
      customBio: selectedAvatar.description
    };

    saveUserProfile(updated);
    onProfileUpdated(updated);
    soundEffects.playSuccess();
    setShowSavedToast(true);

    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="max-w-2xl w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                ویرایش نام و عکس پروفایل
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                نام دلخواه و عکس نمایشی خود را برای بازی‌های آفلاین و آنلاین انتخاب کنید
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 pl-1">
          {/* Live Preview Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                پیش‌نمایش کارت شما در بازی
              </span>
              <button
                type="button"
                onClick={handleRandomizeAll}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <Shuffle className="w-3 h-3" />
                انتخاب تصادفی کل
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800/90 border border-cyan-500/40 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedAvatar.gradient} border-2 border-white/30 flex items-center justify-center text-3xl shadow-xl shadow-cyan-950/40 relative group`}
                >
                  <span className="select-none filter drop-shadow">{selectedAvatar.emoji}</span>
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-[10px] text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                    شما
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {name.trim() || 'قهرمان واژه‌ها'}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-medium">
                      {selectedAvatar.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-sm line-clamp-1">
                    {selectedAvatar.description}
                  </p>
                </div>
              </div>

              {/* 3 Hearts Preview */}
              <div className="flex items-center gap-1 bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
            </div>
          </div>

          {/* Name Customization Input */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="player-name-input" className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>نام نمایشی شما:</span>
              </label>
              <button
                type="button"
                onClick={handleRandomizeName}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                پیشنهاد نام تصادفی
              </button>
            </div>

            <div className="relative">
              <input
                id="player-name-input"
                type="text"
                value={name}
                maxLength={24}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام خود را وارد کنید..."
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-sm font-semibold transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 font-mono">
                {name.length}/24
              </span>
            </div>

            {/* Quick Suggested Names Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400">پیشنهادات سریع:</span>
              {SUGGESTED_NAMES.slice(0, 5).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setName(sug);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    name === sug
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Picture Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>انتخاب عکس و نشان پروفایل:</span>
                <span className="text-xs text-cyan-400 font-normal">
                  ({AVATAR_CATALOG.length} گزینه با تم‌های متنوع)
                </span>
              </label>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[290px] overflow-y-auto p-1 scrollbar-thin">
              {filteredAvatars.map((avatar) => {
                const isSelected = avatar.id === selectedAvatarId;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`relative p-2.5 rounded-2xl border text-right transition-all flex items-center gap-2.5 group ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                        : 'bg-slate-800/50 border-slate-700/70 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {/* Avatar Icon Box */}
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${avatar.gradient} border border-white/20 flex items-center justify-center text-2xl shadow shrink-0`}
                    >
                      <span className="select-none filter drop-shadow">{avatar.emoji}</span>
                    </div>

                    {/* Meta */}
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-200 truncate">
                        {avatar.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {avatar.category}
                      </div>
                    </div>

                    {/* Checkmark when selected */}
                    {isSelected && (
                      <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 relative">
          <AnimatePresence>
            {showSavedToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 bottom-14 flex items-center gap-2 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                پروفایل شما با موفقیت ذخیره شد!
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-all"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            ذخیره و اعمال در بازی
          </button>
        </div>
      </motion.div>
    </div>
  );
};
