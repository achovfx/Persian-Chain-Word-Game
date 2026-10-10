'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Skull, Bot, Sparkles } from 'lucide-react';
import { Player } from '@/lib/game/gameEngine';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  isCompact?: boolean;
}

// 24 deterministic radial explosion particles with varied trajectories and speeds
const ELIMINATION_PARTICLES = [
  { id: 0, x: 55, y: -35, scale: 1.2, color: '#f43f5e', delay: 0, duration: 0.95 },
  { id: 1, x: -60, y: -40, scale: 1.0, color: '#fb7185', delay: 0.04, duration: 1.1 },
  { id: 2, x: 28, y: 65, scale: 1.4, color: '#f59e0b', delay: 0.07, duration: 0.9 },
  { id: 3, x: -45, y: 55, scale: 0.9, color: '#38bdf8', delay: 0.02, duration: 1.05 },
  { id: 4, x: 70, y: 18, scale: 1.1, color: '#ffffff', delay: 0.03, duration: 1.2 },
  { id: 5, x: -75, y: 8, scale: 1.3, color: '#f43f5e', delay: 0.09, duration: 1.0 },
  { id: 6, x: 38, y: -70, scale: 0.8, color: '#fb7185', delay: 0.02, duration: 1.15 },
  { id: 7, x: -32, y: -65, scale: 1.2, color: '#fda4af', delay: 0.06, duration: 0.85 },
  { id: 8, x: 82, y: -16, scale: 0.95, color: '#f59e0b', delay: 0.05, duration: 1.25 },
  { id: 9, x: -18, y: 75, scale: 1.35, color: '#38bdf8', delay: 0.08, duration: 0.95 },
  { id: 10, x: 60, y: 48, scale: 0.85, color: '#f43f5e', delay: 0.01, duration: 1.05 },
  { id: 11, x: -52, y: -22, scale: 1.15, color: '#ffffff', delay: 0.05, duration: 1.2 },
  { id: 12, x: 20, y: -55, scale: 1.0, color: '#fb7185', delay: 0.02, duration: 1.0 },
  { id: 13, x: -65, y: 42, scale: 1.25, color: '#f59e0b', delay: 0.07, duration: 1.25 },
  { id: 14, x: 48, y: -60, scale: 0.9, color: '#38bdf8', delay: 0.03, duration: 0.9 },
  { id: 15, x: -38, y: 70, scale: 1.3, color: '#f43f5e', delay: 0.06, duration: 1.1 },
  { id: 16, x: 68, y: -45, scale: 0.75, color: '#fcd34d', delay: 0.04, duration: 1.0 },
  { id: 17, x: -70, y: -50, scale: 1.1, color: '#f43f5e', delay: 0.08, duration: 1.15 },
  { id: 18, x: 10, y: 80, scale: 1.2, color: '#fb7185', delay: 0.05, duration: 0.95 },
  { id: 19, x: -80, y: 25, scale: 0.85, color: '#38bdf8', delay: 0.03, duration: 1.3 },
  { id: 20, x: 75, y: 55, scale: 1.05, color: '#fda4af', delay: 0.07, duration: 1.0 },
  { id: 21, x: -25, y: -75, scale: 1.15, color: '#ffffff', delay: 0.02, duration: 1.2 },
  { id: 22, x: 85, y: 0, scale: 0.9, color: '#f59e0b', delay: 0.06, duration: 1.1 },
  { id: 23, x: -15, y: -82, scale: 1.2, color: '#f43f5e', delay: 0.04, duration: 1.05 }
];

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  isCompact = false
}) => {
  return (
    <motion.div
      layout
      animate={
        player.isEliminated
          ? {
              // Violent tremor and screen shake on elimination with rotation and fade
              x: [0, -12, 14, -10, 12, -8, 8, -4, 4, 0],
              y: [0, 5, -6, 4, -4, 3, -2, 1, 0],
              rotate: [0, -2.5, 2.5, -2, 2, -1, 1, 0],
              scale: [1, 1.05, 0.96, 1.02, 0.98, 0.95],
              opacity: [1, 1, 0.95, 0.85, 0.7, 0.6],
              borderColor: [
                'rgba(239, 68, 68, 0.95)',
                'rgba(244, 63, 94, 0.8)',
                'rgba(239, 68, 68, 0.35)',
                'rgba(100, 116, 139, 0.2)'
              ],
              boxShadow: [
                '0 0 40px rgba(239, 68, 68, 0.6)',
                '0 0 20px rgba(239, 68, 68, 0.3)',
                'none'
              ]
            }
          : isActive
          ? {
              scale: 1.02,
              opacity: 1,
              borderColor: 'rgba(56, 189, 248, 0.8)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
            }
          : {
              scale: 1,
              opacity: 1,
              borderColor: 'rgba(71, 85, 105, 0.3)',
              boxShadow: 'none'
            }
      }
      transition={{
        duration: player.isEliminated ? 0.9 : 0.25,
        ease: 'easeInOut'
      }}
      className={`relative rounded-2xl border backdrop-blur-md transition-all overflow-hidden ${
        player.isEliminated
          ? 'bg-slate-950/80 border-rose-950/40'
          : isActive
          ? 'bg-gradient-to-br from-slate-900/90 to-cyan-950/70 border-cyan-400'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      } ${isCompact ? 'p-3' : 'p-4 sm:p-5'}`}
    >
      {/* Red flash ambient overlay during elimination tremor */}
      {player.isEliminated && (
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 0.3, 0] }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 bg-gradient-to-r from-rose-600/40 via-red-600/25 to-rose-950/20 pointer-events-none z-20"
        />
      )}

      {/* Active turn top indicator bar */}
      {isActive && !player.isEliminated && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-1" />
      )}

      <div className="flex items-center justify-between gap-3 relative z-10">
        {/* Avatar and Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border transition-transform ${
              player.isEliminated
                ? 'border-rose-500/30 bg-rose-950/30 text-slate-500 grayscale'
                : isActive
                ? 'scale-105 border-cyan-400 bg-cyan-950/60'
                : 'border-slate-700/80 bg-slate-800/80'
            }`}
          >
            {player.isAI ? (
              <Bot className={`w-6 h-6 ${player.isEliminated ? 'text-rose-400/50' : 'text-cyan-400'}`} />
            ) : (
              <span>{player.avatar}</span>
            )}

            {isActive && !player.isEliminated && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className={`text-sm sm:text-base font-bold truncate ${player.isEliminated ? 'text-slate-500 line-through decoration-rose-500/70' : 'text-white'}`}>
                {player.name}
              </h4>
              {player.isAI && (
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded font-medium shrink-0">
                  ربات
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{player.wordsSubmitted.length} کلمه</span>
              {isActive && !player.isEliminated && (
                <span className="text-cyan-400 font-semibold inline-flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  نوبت بازی
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lives Counter & Elimination Animation Zone */}
        <div className="relative flex flex-col items-end shrink-0">
          {player.isEliminated ? (
            <div className="relative flex items-center">
              {/* Particle Burst Explosion radiating outward */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {ELIMINATION_PARTICLES.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      opacity: 0,
                      scale: 0.1
                    }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    style={{ backgroundColor: p.color }}
                    className="absolute w-2 h-2 rounded-full shadow-md shadow-rose-950/50"
                  />
                ))}
              </div>

              {/* Animated Shattered Hearts Splitting and Cracking Apart */}
              <div className="flex items-center gap-1.5 mr-2">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="relative w-6 h-6 flex items-center justify-center">
                    {/* Fractured Left Half flying northwest */}
                    <motion.div
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: -24 - idx * 8,
                        y: -14 + idx * 8,
                        rotate: -60 - idx * 15,
                        opacity: 0,
                        scale: 0.4
                      }}
                      transition={{ duration: 1.0, delay: idx * 0.12, ease: 'easeOut' }}
                      className="absolute text-rose-500 font-bold select-none pointer-events-none drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]"
                    >
                      💔
                    </motion.div>
                    {/* Fractured Right Half flying southeast */}
                    <motion.div
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: 24 + idx * 8,
                        y: 16 + idx * 8,
                        rotate: 60 + idx * 15,
                        opacity: 0,
                        scale: 0.4
                      }}
                      transition={{ duration: 1.0, delay: idx * 0.12, ease: 'easeOut' }}
                      className="absolute text-rose-500 font-bold select-none pointer-events-none drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]"
                    >
                      💔
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Skull Badge with dramatic spring impact animation */}
              <motion.div
                initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.45 }}
                className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-950/80 px-2.5 py-1 rounded-xl border border-rose-500/50 shadow-xl shadow-rose-950/80"
              >
                <Skull className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>حذف از بازی</span>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {Array.from({ length: player.maxLives }, (_, idx) => {
                const hasLife = idx < player.lives;
                return (
                  <AnimatePresence key={idx} mode="wait">
                    {hasLife ? (
                      <motion.div
                        key="alive"
                        initial={{ scale: 0.7 }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                      </motion.div>
                    ) : (
                      /* Fracturing broken heart when a single life is lost */
                      <motion.div
                        key="dead"
                        initial={{ scale: 1.5, rotate: 15 }}
                        animate={{ scale: 0.9, rotate: 0, opacity: 0.35 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                      >
                        <Heart className="w-5 h-5 text-slate-600 stroke-[1.5]" />
                        <motion.span
                          initial={{ opacity: 1, scale: 1, y: 0 }}
                          animate={{ opacity: 0, scale: 1.6, y: -8 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 flex items-center justify-center text-xs text-rose-500 pointer-events-none"
                        >
                          💔
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
