'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, HelpCircle, Heart, ArrowLeft, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const steps = [
    {
      title: '۱. چرخش چرخونه و انتخاب حرف نخست',
      desc: 'در آغاز بازی، چرخونه با جلوه‌ای زیبا به گردش درمی‌آید و یک حرف از الفبای پارسی به عنوان حرف شروع برگزیده می‌شود.',
      icon: RefreshCw,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
    },
    {
      title: '۲. قانون زنجیره واژگان',
      desc: 'هر بازیکن در نوبت خود باید کلمه‌ای بنویسد که با حرف تعیین‌شده شروع شود. آخرین حرف کلمه شما، تبدیل به حرف شروع بازیکن بعدی خواهد شد!',
      icon: ArrowLeft,
      color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30'
    },
    {
      title: '۳. سه قلب طلایی (جان‌ها)',
      desc: 'هر بازیکن با دقیقا ۳ جان آغاز می‌کند. با ثبت کلمه اشتباه، تکرار کلمه قبلی، شروع با حرف نادرست، یا اتمام زمان، یک جان از دست می‌رود.',
      icon: Heart,
      color: 'text-rose-400 bg-rose-950/60 border-rose-500/30'
    },
    {
      title: '۴. بقا و تاج قهرمانی',
      desc: 'با اتمام جان‌ها بازیکن از بازی کنار می‌رود و آخرین بازمانده قهرمان میدان خواهد شد! واژه‌نامه بازی بیش از هزاران کلمه معتبر دارد.',
      icon: Trophy,
      color: 'text-amber-400 bg-amber-950/60 border-amber-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/50 space-y-5 max-h-[88vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">راهنمای بازی زنجیره کلمات</h3>
              <p className="text-xs text-slate-400">قوانین و چگونگی مشاعره و پیروزی</p>
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

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((st, i) => {
            const IconComponent = st.icon;
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5 text-right"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${st.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{st.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Example block */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>یک مثال ساده:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            اگر بازیکن اول واژه «<strong>باران</strong>» را بگوید (پایان با حرف نون)، بازیکن دوم باید کلمه‌ای با نون بگوید مثل «<strong>نرگس</strong>» (پایان با سین)، و بازیکن سوم واژه‌ای با سین مثل «<strong>سیب</strong>»!
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
        >
          متوجه شدم، بزن بریم بازی!
        </button>
      </motion.div>
    </div>
  );
};
