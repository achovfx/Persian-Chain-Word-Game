'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Search, BookOpen, Sparkles, Filter, Plus } from 'lucide-react';
import { persianDictionary } from '@/lib/persian/dictionary';
import { PERSIAN_ALPHABET, PERSIAN_LETTER_NAMES, normalizePersian } from '@/lib/persian/normalizer';
import { soundEffects } from '@/lib/audio/soundEffects';
import { PersianWordEntry } from '@/lib/persian/vocabularyList';

interface DictionaryModalProps {
  onClose: () => void;
  initialSearchWord?: string;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  onClose,
  initialSearchWord = ''
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchWord);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [newWord, setNewWord] = useState('');
  const [addFeedback, setAddFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [customWordsVersion, setCustomWordsVersion] = useState(0);
  const [isExplaining, setIsExplaining] = useState(false);
  const totalCount = persianDictionary.getWordCount();

  const handleFetchAIExplanation = async (word: string) => {
    if (expandedWord === word) {
      setExpandedWord(null);
      setAiExplanation(null);
      return;
    }

    setExpandedWord(word);
    setIsExplaining(true);
    setAiExplanation(null);

    try {
      const res = await fetch('/api/dictionary-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation('توضیحاتی برای این واژه دریافت نشد.');
      }
    } catch {
      setAiExplanation('ارتباط با سرور برقرار نشد، اما واژه در دایره لغات بازی معتبر است.');
    } finally {
      setIsExplaining(false);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  const handleAddCustomWord = () => {
    const word = newWord.trim();
    if (!word) { setAddFeedback({ type: 'error', message: 'اول یک واژه وارد کن.' }); return; }
    if (persianDictionary.getWordEntry(word)) { setAddFeedback({ type: 'error', message: 'این واژه از قبل در واژه‌نامه وجود دارد.' }); return; }
    const entry = persianDictionary.addCustomWord(word);
    if (!entry) { setAddFeedback({ type: 'error', message: 'واژه باید حداقل دو حرف فارسی داشته باشد و عدد یا نشانه نداشته باشد.' }); return; }
    try {
      const saved = JSON.parse(window.localStorage.getItem('zanjireh_custom_persian_words') || '[]');
      const words: string[] = Array.isArray(saved) ? saved.filter((item): item is string => typeof item === 'string') : [];
      words.push(entry.word);
      window.localStorage.setItem('zanjireh_custom_persian_words', JSON.stringify(words));
    } catch {
      setAddFeedback({ type: 'error', message: 'ذخیره‌سازی در این مرورگر در دسترس نیست؛ واژه فقط تا بارگذاری مجدد فعال می‌ماند.' });
      setCustomWordsVersion((v) => v + 1); setNewWord(''); return;
    }
    setAddFeedback({ type: 'success', message: '«' + entry.word + '» به واژه‌نامه اضافه شد.' });
    setNewWord(''); setSearchQuery(entry.word); setSelectedLetter(null); setSelectedCategory('همه');
    setCustomWordsVersion((v) => v + 1); soundEffects.playClick();
  };


  const categories = [
    'همه',
    'نام‌ها و اشخاص',
    'جغرافیا و مکان‌ها',
    'طبیعت',
    'خوراکی',
    'حیوانات',
    'ادبیات',
    'علم',
    'هنر',
    'اشیاء',
    'فرهنگ و واژگان',
    'واژگان عمومی و تخصصی',
    'مفاهیم',
    'مشاغل',
    'ورزش',
    'تاریخ',
    'صفات'
  ];

  const filteredWords = useMemo(() => {
    let list: PersianWordEntry[] = [];
    const trimmed = searchQuery.trim();

    if (trimmed) {
      const norm = normalizePersian(trimmed);
      const exact = persianDictionary.getWordEntry(norm);
      if (exact) {
        list = [exact];
      } else {
        const firstL = norm.charAt(0);
        const letterWords = persianDictionary.getWordsByStartLetter(firstL);
        list = letterWords.filter((w) => w.normalized.includes(norm)).slice(0, 150);
      }
    } else if (selectedLetter) {
      list = persianDictionary.getWordsByStartLetter(selectedLetter);
    } else {
      list = persianDictionary.getWordsByStartLetter('ا');
    }

    if (selectedCategory !== 'همه') {
      list = list.filter((w) => w.category === selectedCategory);
    }

    return list.slice(0, 200);
  }, [searchQuery, selectedLetter, selectedCategory, customWordsVersion]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">واژه‌نامه رسمی بازی</h3>
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  {totalCount.toLocaleString('fa-IR')} واژه معتبر
                </span>
              </div>
              <p className="text-xs text-slate-400">
                بررسی لغات مجاز، معانی و حروف شروع و پایان
              </p>
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

        {/* Search input */}
        <div className="mt-4 shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedLetter) setSelectedLetter(null);
              }}
              placeholder="جستجوی واژه در لغت‌نامه..."
              className="w-full bg-slate-950/80 text-white text-sm font-semibold rounded-xl py-2.5 pr-10 pl-4 border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              dir="rtl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 text-xs text-slate-400 hover:text-white"
              >
                پاک کردن
              </button>
            )}
          </div>
        </div>

        {/* Add a custom word to this browser's personal dictionary */}
        <form onSubmit={(e) => { e.preventDefault(); handleAddCustomWord(); }} className="mt-3 shrink-0 rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-3">
          <label className="mb-2 block text-xs font-bold text-emerald-300">افزودن دستی واژه</label>
          <div className="flex gap-2">
            <input value={newWord} onChange={(e) => { setNewWord(e.target.value); setAddFeedback(null); }} placeholder="واژه فارسی جدید را بنویس..." className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none" dir="rtl" maxLength={40} />
            <button type="submit" className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-500"><Plus className="h-4 w-4" /> افزودن</button>
          </div>
          {addFeedback && <p role="status" className={'mt-2 text-xs ' + (addFeedback.type === 'success' ? 'text-emerald-300' : 'text-rose-300')}>{addFeedback.message}</p>}
          <p className="mt-1 text-[10px] text-slate-400">واژه‌های اضافه‌شده در همین مرورگر ذخیره می‌شوند.</p>
        </form>

        {/* Alphabet Letter Strip */}
        <div className="mt-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                soundEffects.playClick();
                setSelectedLetter(null);
                setSearchQuery('');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 border transition-all ${
                selectedLetter === null && !searchQuery
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              همه
            </button>
            {PERSIAN_ALPHABET.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedLetter(letter);
                    setSearchQuery('');
                  }}
                  className={`w-8 h-8 rounded-lg shrink-0 text-xs font-black border transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm shadow-cyan-500/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-cyan-300'
                  }`}
                  title={PERSIAN_LETTER_NAMES[letter] || letter}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map((cat) => {
              const isCatSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg shrink-0 border transition-all ${
                    isCatSelected
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-sm'
                      : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Word Cards List */}
        <div className="mt-2 overflow-y-auto space-y-2 pr-1 flex-1">
          {filteredWords.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              واژه‌ای مطابق با جستجوی شما یافت نشد.
            </div>
          ) : (
            filteredWords.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-3 text-right"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">
                      {entry.word}
                    </span>
                    <span className="text-[11px] text-cyan-400 bg-cyan-950/70 border border-cyan-500/20 px-2 py-0.5 rounded-md font-semibold">
                      {entry.category}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        entry.difficulty === 'easy'
                          ? 'text-emerald-400 bg-emerald-950/50'
                          : entry.difficulty === 'medium'
                          ? 'text-amber-400 bg-amber-950/50'
                          : 'text-purple-400 bg-purple-950/50'
                      }`}
                    >
                      {entry.difficulty === 'easy' ? 'آسان' : entry.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                    {entry.meaning}
                  </p>

                  {/* AI Detailed explanation section if opened */}
                  {expandedWord === entry.word && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-900 border border-cyan-500/20 text-xs text-cyan-200">
                      {isExplaining ? (
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>در حال دریافت تحلیل ادبی و بیت شعر نمونه...</span>
                        </div>
                      ) : aiExplanation ? (
                        <div className="space-y-1.5">
                          <span className="font-bold text-cyan-300 block">شرح ادبی و کاربرد در شعر:</span>
                          <p className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">{aiExplanation}</p>
                        </div>
                      ) : (
                        <span>توضیحی یافت نشد.</span>
                      )}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFetchAIExplanation(entry.word)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{expandedWord === entry.word ? 'بستن شرح ادبی' : 'شرح ادبی و شعر نمونه'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-left shrink-0 text-[11px] text-slate-400 font-mono">
                  <div>
                    شروع: <strong className="text-cyan-400">{entry.normalized.charAt(0)}</strong>
                  </div>
                  <div>
                    پایان: <strong className="text-amber-400">{entry.normalized.slice(-1)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>نمایش {filteredWords.length} مورد</span>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </div>
  );
};
