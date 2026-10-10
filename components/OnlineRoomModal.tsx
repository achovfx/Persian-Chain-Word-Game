'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, Users, Play, Sparkles, Link2, LogIn, Plus } from 'lucide-react';
import { OnlineRoom } from '@/lib/rooms/roomStore';
import { soundEffects } from '@/lib/audio/soundEffects';
import { AVATAR_OPTIONS } from '@/lib/game/gameEngine';
import { loadUserProfile, AVATAR_CATALOG } from '@/lib/profile/profileStore';

interface OnlineRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomId?: string;
  initialPlayerCount?: number;
  onRoomGameStarted: (room: OnlineRoom, currentPlayerId: string) => void;
}

export const OnlineRoomModal: React.FC<OnlineRoomModalProps> = ({
  isOpen,
  onClose,
  initialRoomId = '',
  initialPlayerCount,
  onRoomGameStarted
}) => {
  const [tab, setTab] = useState<'CREATE' | 'JOIN' | 'LOBBY'>(initialRoomId ? 'JOIN' : 'CREATE');
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window !== 'undefined') {
      return loadUserProfile().name;
    }
    return 'قهرمان واژه‌ها';
  });
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    if (typeof window !== 'undefined') {
      return loadUserProfile().avatarEmoji;
    }
    return '🦁';
  });

  // Player count selection: 2, 4, 6, 8, or custom
  const [playerCountOption, setPlayerCountOption] = useState<number | 'CUSTOM'>(() => {
    if (initialPlayerCount === 0) return 'CUSTOM';
    if (initialPlayerCount && [2, 4, 6, 8].includes(initialPlayerCount)) return initialPlayerCount;
    return 4;
  });
  const [customCountInput, setCustomCountInput] = useState('5');

  // Active room state
  const [currentRoom, setCurrentRoom] = useState<OnlineRoom | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [joinCodeInput, setJoinCodeInput] = useState(initialRoomId);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Polling for live room state when in lobby
  useEffect(() => {
    if (tab !== 'LOBBY' || !currentRoom) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${currentRoom.id}`);
        const data = await res.json();
        if (data.success && data.room) {
          setCurrentRoom(data.room);

          // If host started match, trigger game start for all joined clients!
          if (data.room.status === 'PLAYING') {
            clearInterval(interval);
            onRoomGameStarted(data.room, myPlayerId);
          }
        }
      } catch {
        // Silently retry on next poll
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [tab, currentRoom, myPlayerId, onRoomGameStarted]);

  if (!isOpen) return null;

  const actualPlayerCount =
    playerCountOption === 'CUSTOM'
      ? Math.max(2, Math.min(12, parseInt(customCountInput, 10) || 4))
      : playerCountOption;

  // Create room
  const handleCreateRoom = async () => {
    setErrorMessage('');
    setIsLoading(true);
    soundEffects.playClick();

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: playerName,
          maxPlayers: actualPlayerCount
        })
      });

      const data = await res.json();
      if (data.success && data.room) {
        setCurrentRoom(data.room);
        setMyPlayerId(data.playerId);
        setTab('LOBBY');
      } else {
        setErrorMessage(data.error || 'خطا در ساخت اتاق');
      }
    } catch {
      setErrorMessage('ارتباط با سرور برقرار نشد.');
    } finally {
      setIsLoading(false);
    }
  };

  // Join room
  const handleJoinRoom = async () => {
    const code = joinCodeInput.trim().toUpperCase();
    if (!code) {
      setErrorMessage('لطفاً کد اتاق را وارد کنید.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    soundEffects.playClick();

    try {
      const res = await fetch(`/api/rooms/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          playerName,
          avatar: selectedAvatar
        })
      });

      const data = await res.json();
      if (data.success && data.room && data.player) {
        setCurrentRoom(data.room);
        setMyPlayerId(data.player.id);
        setTab('LOBBY');
      } else {
        setErrorMessage(data.error || 'خطا در ورود به اتاق');
      }
    } catch {
      setErrorMessage('ارتباط با سرور برقرار نشد.');
    } finally {
      setIsLoading(false);
    }
  };

  // Host starts online match
  const handleStartOnlineMatch = async () => {
    if (!currentRoom) return;
    setIsLoading(true);
    soundEffects.playClick();

    try {
      const res = await fetch(`/api/rooms/${currentRoom.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          playerId: myPlayerId
        })
      });

      const data = await res.json();
      if (data.success && data.room) {
        onRoomGameStarted(data.room, myPlayerId);
      } else {
        setErrorMessage(data.error || 'شروع بازی با خطا مواجه شد.');
      }
    } catch {
      setErrorMessage('ارتباط با سرور برقرار نشد.');
    } finally {
      setIsLoading(false);
    }
  };

  // Invite Link
  const inviteUrl =
    typeof window !== 'undefined' && currentRoom
      ? `${window.location.origin}/?room=${currentRoom.id}`
      : '';

  const handleCopyInviteLink = () => {
    if (!inviteUrl) return;
    soundEffects.playClick();
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share && inviteUrl) {
      navigator.share({
        title: 'زنجیره کلمات فارسی',
        text: `بیا با هم زنجیره کلمات بازی کنیم! کد اتاق: ${currentRoom?.id}`,
        url: inviteUrl
      }).catch(() => {});
    } else {
      handleCopyInviteLink();
    }
  };

  const isHost = currentRoom && currentRoom.hostId === myPlayerId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/50 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">اتاق بازی آنلاین چندنفره</h3>
              <p className="text-xs text-slate-400">بازی همزمان با دوستان از طریق لینک دعوت</p>
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

        {/* Tab Switcher if not in lobby */}
        {tab !== 'LOBBY' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                soundEffects.playClick();
                setTab('CREATE');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'CREATE'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ساخت اتاق جدید
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setTab('JOIN');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'JOIN'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ورود با کد یا لینک
            </button>
          </div>
        )}

        {/* Player Name and Avatar Picker */}
        {tab !== 'LOBBY' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                نام نمایشی شما:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="نام خود را بنویسید..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:border-cyan-400 focus:outline-none"
                dir="rtl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                انتخاب نشان یا آواتار:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {AVATAR_CATALOG.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedAvatar(av.emoji);
                    }}
                    title={av.title}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center shrink-0 border transition-all ${
                      selectedAvatar === av.emoji
                        ? 'bg-gradient-to-tr ' + av.gradient + ' border-cyan-300 ring-2 ring-cyan-400 scale-105 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:scale-105'
                    }`}
                  >
                    <span>{av.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CREATE ROOM */}
        {tab === 'CREATE' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                تعداد بازیکنان مسابقه:
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[2, 4, 6, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setPlayerCountOption(count);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      playerCountOption === count
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {count} نفره
                  </button>
                ))}
              </div>

              {/* Custom Count Option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setPlayerCountOption('CUSTOM');
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                    playerCountOption === 'CUSTOM'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>تعداد دلخواه بازیکنان</span>
                  <Plus className="w-4 h-4 text-cyan-400" />
                </button>

                {playerCountOption === 'CUSTOM' && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-slate-950/70 border border-cyan-500/30 rounded-xl">
                    <span className="text-xs text-slate-300 shrink-0">ورود عدد دلخواه (۲ تا ۱۲ نفر):</span>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={customCountInput}
                      onChange={(e) => setCustomCountInput(e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={isLoading || !playerName.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Link2 className="w-4 h-4" />
              <span>{isLoading ? 'در حال ایجاد اتاق...' : 'ایجاد اتاق و دریافت لینک دعوت'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: JOIN ROOM */}
        {tab === 'JOIN' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                کد یا لینک اتاق:
              </label>
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => {
                  const val = e.target.value;
                  // If pasted full URL, extract code
                  if (val.includes('room=')) {
                    const match = val.match(/room=([A-Za-z0-9]+)/);
                    setJoinCodeInput(match ? match[1].toUpperCase() : val);
                  } else {
                    setJoinCodeInput(val.toUpperCase());
                  }
                }}
                placeholder="مثال: ABC12"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center font-mono tracking-widest text-lg text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={isLoading || !joinCodeInput.trim() || !playerName.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'در حال پیوستن...' : 'ورود به اتاق بازی'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: WAITING ROOM LOBBY */}
        {tab === 'LOBBY' && currentRoom && (
          <div className="space-y-5">
            {/* Share Link Banner */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">کد اتاق بازی:</span>
                <span className="font-mono text-lg font-black text-white px-2.5 py-0.5 rounded-lg bg-slate-950 border border-cyan-500/40 tracking-wider">
                  {currentRoom.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all truncate"
                />

                <button
                  onClick={handleCopyInviteLink}
                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  title="کپی لینک دعوت"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'کپی شد!' : 'کپی لینک'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl border border-slate-700 transition-colors shrink-0"
                  title="اشتراک‌گذاری"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                لینک بالا را برای دوستان خود بفرستید تا فوراً به این مسابقه ملحق شوند.
              </p>
            </div>

            {/* Players Joined List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">
                  بازیکنان حاضر ({currentRoom.players.length} از {currentRoom.maxPlayers}):
                </span>
                <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  در حال انتظار
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {currentRoom.players.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2"
                  >
                    <span className="text-xl">{p.avatar}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {p.name}
                      </span>
                      {p.id === currentRoom.hostId && (
                        <span className="text-[10px] text-amber-400 font-semibold block">
                          میزبان اتاق
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isHost ? (
              <button
                onClick={handleStartOnlineMatch}
                disabled={currentRoom.players.length < 2 || isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {currentRoom.players.length < 2
                    ? 'حداقل ۲ بازیکن برای شروع لازم است'
                    : 'شروع مسابقه آنلاین'}
                </span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>منتظر میزبان برای آغاز بازی باشید...</span>
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}
      </motion.div>
    </div>
  );
};
