/**
 * User Profile Store & Avatar Catalog
 * Manages player's custom name, selected avatar/picture, persistence in localStorage,
 * and customizable avatar catalog with Persian mythological and modern character portraits.
 */

export interface AvatarOption {
  id: string;
  emoji: string;
  title: string;
  category: 'اساطیری و باستانی' | 'حیوانات و نمادها' | 'شخصیت‌ها و مشاهیر' | 'نشان‌ها و فانتزی';
  badgeColor: string;
  gradient: string;
  description: string;
}

export interface UserProfile {
  name: string;
  avatarId: string;
  avatarEmoji: string;
  avatarTitle: string;
  badgeColor: string;
  gradient: string;
  customBio?: string;
}

export const AVATAR_CATALOG: AvatarOption[] = [
  // --- اساطیری و باستانی ---
  {
    id: 'persian_lion',
    emoji: '🦁',
    title: 'شیر ایرانی',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-amber-400 text-amber-300',
    gradient: 'from-amber-600 via-orange-600 to-amber-800',
    description: 'نماد دلیری، اصالت و شکوه شاهنامه'
  },
  {
    id: 'simurgh',
    emoji: '🦅',
    title: 'شاهین البرز',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-cyan-400 text-cyan-300',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-800',
    description: 'نگهبان قله‌های بلند و نماد فر و شکوه'
  },
  {
    id: 'cheetah',
    emoji: '🐆',
    title: 'یوزپلنگ ایران',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-yellow-400 text-yellow-300',
    gradient: 'from-yellow-600 via-amber-600 to-yellow-800',
    description: 'سریع‌ترین دونده دشت‌ها و مظهر چابکی'
  },
  {
    id: 'rakhsh',
    emoji: '🐎',
    title: 'رخش دستان',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-emerald-400 text-emerald-300',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-800',
    description: 'اسب اسطوره‌ای رستم در هفت‌خوان'
  },
  {
    id: 'rostam',
    emoji: '🛡️',
    title: 'رستم پهلوان',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-orange-500 text-orange-300',
    gradient: 'from-orange-700 via-red-600 to-amber-900',
    description: 'جهان‌پهلوان نامدار تاریخ و پاسدار ایران'
  },
  {
    id: 'arash',
    emoji: '🏹',
    title: 'آرش کمانگیر',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-sky-400 text-sky-300',
    gradient: 'from-sky-600 via-indigo-600 to-blue-900',
    description: 'جان بر کف نهاد و مرز وطن را بگسترد'
  },
  {
    id: 'gordafarid',
    emoji: '👸',
    title: 'بانو گردآفرید',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-pink-400 text-pink-300',
    gradient: 'from-pink-600 via-rose-600 to-purple-800',
    description: 'شیرزن دلاور دژ سپید در نبرد تن به تن'
  },
  {
    id: 'cyrus',
    emoji: '👑',
    title: 'شهریار پارس',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-amber-300 text-amber-200',
    gradient: 'from-yellow-600 via-amber-500 to-yellow-800',
    description: 'نماد عدالت، منشور صلح و بزرگواری'
  },
  {
    id: 'kaveh',
    emoji: '⚒️',
    title: 'کاوه دادخواه',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-red-400 text-red-300',
    gradient: 'from-red-600 via-orange-600 to-stone-800',
    description: 'درفش کاویانی بر افراشت در برابر ستم'
  },
  {
    id: 'homa',
    emoji: '🦚',
    title: 'طاووس و هما',
    category: 'اساطیری و باستانی',
    badgeColor: 'border-teal-300 text-teal-200',
    gradient: 'from-teal-600 via-emerald-600 to-blue-800',
    description: 'مرغ فرخنده بخت و شکوه تخت جمشید'
  },

  // --- حیوانات و نمادها ---
  {
    id: 'wise_owl',
    emoji: '🦉',
    title: 'جغد خردمند',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-purple-400 text-purple-300',
    gradient: 'from-purple-700 via-indigo-600 to-slate-800',
    description: 'نماد خرد، فرزانگی و بیداری شبانه'
  },
  {
    id: 'clever_fox',
    emoji: '🦊',
    title: 'روباه تیزهوش',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-orange-400 text-orange-300',
    gradient: 'from-orange-500 via-amber-600 to-rose-700',
    description: 'زیرک در رقابت و پیدا کردن کلمات دشوار'
  },
  {
    id: 'dolphin',
    emoji: '🐬',
    title: 'دلفین خلیج فارس',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-cyan-300 text-cyan-200',
    gradient: 'from-cyan-500 via-blue-500 to-teal-700',
    description: 'هوشمند، شوخ‌طبع و بازیگوش در زنجیره'
  },
  {
    id: 'phoenix',
    emoji: '🔥',
    title: 'ققنوس آتشین',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-rose-400 text-rose-300',
    gradient: 'from-rose-600 via-red-500 to-amber-600',
    description: 'از خاکستر برمی‌خیزد و هرگز تسلیم نمی‌شود'
  },
  {
    id: 'alborz_wolf',
    emoji: '🐺',
    title: 'گرگ کوهستان',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-slate-300 text-slate-200',
    gradient: 'from-slate-600 via-zinc-700 to-stone-800',
    description: 'سرکش، با اراده و صبور در آزمون‌های سخت'
  },
  {
    id: 'shiraz_rose',
    emoji: '🌹',
    title: 'گل سرخ شیراز',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-rose-400 text-rose-200',
    gradient: 'from-rose-700 via-pink-600 to-red-900',
    description: 'زیبایی عطرآگین حافظیه و باغ ارم'
  },
  {
    id: 'persian_cat',
    emoji: '🐱',
    title: 'گربه اصیل ایرانی',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-blue-300 text-blue-200',
    gradient: 'from-blue-500 via-indigo-500 to-violet-700',
    description: 'آرام، مغرور و دقیق در انتخاب حرکات'
  },
  {
    id: 'soaring_dove',
    emoji: '🕊️',
    title: 'کبوتر صلح',
    category: 'حیوانات و نمادها',
    badgeColor: 'border-sky-300 text-sky-200',
    gradient: 'from-sky-400 via-blue-400 to-indigo-600',
    description: 'پیام‌آور دوستی و پاکی در میدان سخن'
  },

  // --- شخصیت‌ها و مشاهیر ---
  {
    id: 'bard_ferdowsi',
    emoji: '📜',
    title: 'حکیم طوس',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-amber-400 text-amber-200',
    gradient: 'from-amber-700 via-yellow-700 to-stone-900',
    description: 'سی سال عجم زنده کرد بدین پارسی'
  },
  {
    id: 'hafez_poet',
    emoji: '🪕',
    title: 'حافظ شیرین‌سخن',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-teal-400 text-teal-200',
    gradient: 'from-teal-700 via-cyan-700 to-blue-900',
    description: 'لسان‌الغیب و پادشاه غزل‌های عاشقانه'
  },
  {
    id: 'word_ninja',
    emoji: '🥷',
    title: 'نینجای واژه‌ها',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-emerald-400 text-emerald-300',
    gradient: 'from-emerald-800 via-teal-900 to-slate-950',
    description: 'سریع و نامرئی در ثبت ثانیه‌های پایانی'
  },
  {
    id: 'alchemist',
    emoji: '🧙‍♂️',
    title: 'کیمیاگر کلمات',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-violet-400 text-violet-300',
    gradient: 'from-violet-700 via-purple-700 to-fuchsia-900',
    description: 'حروف ساده را به طلای واژگان بدل می‌کند'
  },
  {
    id: 'astronaut',
    emoji: '👨‍🚀',
    title: 'کیهان‌نورد',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-blue-400 text-blue-300',
    gradient: 'from-blue-600 via-indigo-600 to-slate-900',
    description: 'کاوشگر کهکشان اندیشه و ناشناخته‌ها'
  },
  {
    id: 'detective',
    emoji: '🕵️‍♂️',
    title: 'کارآگاه لغات',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-amber-500 text-amber-300',
    gradient: 'from-amber-700 via-stone-700 to-stone-900',
    description: 'کلمات مخفی و نایاب را موشکافانه کشف می‌کند'
  },
  {
    id: 'artist_negar',
    emoji: '🎨',
    title: 'نگار هنرمند',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-pink-400 text-pink-300',
    gradient: 'from-pink-600 via-fuchsia-600 to-rose-800',
    description: 'خلق شاهکارهای مینیاتور و ترکیب الفاظ'
  },
  {
    id: 'scientist',
    emoji: '🧑‍🔬',
    title: 'دانشمند لغت‌شناس',
    category: 'شخصیت‌ها و مشاهیر',
    badgeColor: 'border-emerald-400 text-emerald-200',
    gradient: 'from-emerald-600 via-teal-700 to-slate-900',
    description: 'مسلط بر ریشه‌شناسی و ساختارهای زبانی'
  },

  // --- نشان‌ها و فانتزی ---
  {
    id: 'diamond',
    emoji: '💎',
    title: 'الماس درخشان',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-cyan-300 text-cyan-200',
    gradient: 'from-cyan-500 via-sky-500 to-blue-700',
    description: 'سخت، درخشان و تزلزل‌ناپذیر در مسابقات'
  },
  {
    id: 'lightning',
    emoji: '⚡',
    title: 'صاعقه پیروزی',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-yellow-300 text-yellow-200',
    gradient: 'from-yellow-500 via-amber-500 to-orange-700',
    description: 'پاسخ‌های آنی در کمتر از پنج ثانیه'
  },
  {
    id: 'star',
    emoji: '🌟',
    title: 'ستاره بخت',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-amber-300 text-amber-200',
    gradient: 'from-amber-400 via-yellow-500 to-orange-600',
    description: 'نور هدایت‌بخش در لحظات حساس بازی'
  },
  {
    id: 'trophy',
    emoji: '🏆',
    title: 'فاتح جام زرین',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-amber-400 text-amber-300',
    gradient: 'from-yellow-600 via-amber-600 to-amber-900',
    description: 'هدفمند برای رسیدن به بالاترین امتیازها'
  },
  {
    id: 'target',
    emoji: '🎯',
    title: 'تک‌خال حروف',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-red-400 text-red-300',
    gradient: 'from-red-600 via-rose-600 to-amber-700',
    description: 'دقیق‌ترین نشانه‌گیر حروف آخر'
  },
  {
    id: 'cyber_bot',
    emoji: '🤖',
    title: 'سایبر هما',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-indigo-400 text-indigo-300',
    gradient: 'from-indigo-600 via-violet-600 to-slate-900',
    description: 'محاسبات پیشرفته هوش با روحی پارسی'
  },
  {
    id: 'crystal_ball',
    emoji: '🔮',
    title: 'گوی جادو',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-purple-300 text-purple-200',
    gradient: 'from-purple-600 via-fuchsia-700 to-indigo-900',
    description: 'پیش‌بینی حرکات بعدی رقیبان'
  },
  {
    id: 'persian_nazar',
    emoji: '🧿',
    title: 'چشم‌نظر فیروزه‌ای',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-blue-300 text-blue-200',
    gradient: 'from-blue-600 via-sky-600 to-indigo-800',
    description: 'سپر ایمنی در برابر اشتباهات و از دست دادن جان'
  },
  {
    id: 'ocean_wave',
    emoji: '🌊',
    title: 'موج خروشان',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-cyan-400 text-cyan-200',
    gradient: 'from-cyan-600 via-blue-600 to-teal-800',
    description: 'جریان مداوم کلمات بدون لحظه‌ای توقف'
  },
  {
    id: 'speed_rocket',
    emoji: '🚀',
    title: 'موشک شتاب',
    category: 'نشان‌ها و فانتزی',
    badgeColor: 'border-rose-400 text-rose-300',
    gradient: 'from-rose-600 via-orange-600 to-red-800',
    description: 'پرتاب به اوج جدول برترین‌ها'
  }
];

export const SUGGESTED_NAMES: string[] = [
  'آرش واژه‌ساز',
  'پریا تیزهوش',
  'سهراب دلاور',
  'نگار خردمند',
  'شهریار سخن',
  'کیانوش چالاک',
  'ماندانا فرزانه',
  'برسام شجاع',
  'تهمینه پیروز',
  'رادین خوش‌کلام',
  'آتوسا ادیب',
  'سورنا کمان‌دار',
  'شیرزاد پارسی',
  'آیدین حاضر‌جواب',
  'دلارا خوش‌بیان',
  'ماهان نکته‌سنج'
];

const PROFILE_STORAGE_KEY = 'persian_word_chain_user_profile_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'قهرمان واژه‌ها',
  avatarId: 'persian_lion',
  avatarEmoji: '🦁',
  avatarTitle: 'شیر ایرانی',
  badgeColor: 'border-amber-400 text-amber-300',
  gradient: 'from-amber-600 via-orange-600 to-amber-800',
  customBio: 'آماده برای مسابقه هیجان‌انگیز زنجیره کلمات'
};

/**
 * Loads user profile from browser localStorage with safe fallback
 */
export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_PROFILE;
  }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;

    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (!parsed.name) return DEFAULT_USER_PROFILE;

    // Validate avatar exists in catalog
    const matchingAvatar = AVATAR_CATALOG.find((a) => a.id === parsed.avatarId) || AVATAR_CATALOG[0];

    return {
      name: parsed.name.trim().slice(0, 24) || DEFAULT_USER_PROFILE.name,
      avatarId: matchingAvatar.id,
      avatarEmoji: matchingAvatar.emoji,
      avatarTitle: matchingAvatar.title,
      badgeColor: matchingAvatar.badgeColor,
      gradient: matchingAvatar.gradient,
      customBio: parsed.customBio || DEFAULT_USER_PROFILE.customBio
    };
  } catch (err) {
    console.warn('Could not read user profile from storage', err);
    return DEFAULT_USER_PROFILE;
  }
}

/**
 * Saves user profile to localStorage and notifies listeners
 */
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: profile }));
  } catch (err) {
    console.error('Could not save user profile', err);
  }
}

/**
 * Generates a random fun profile with unique name and avatar
 */
export function getRandomProfile(): UserProfile {
  const randomName = SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
  const randomAvatar = AVATAR_CATALOG[Math.floor(Math.random() * AVATAR_CATALOG.length)];

  return {
    name: randomName,
    avatarId: randomAvatar.id,
    avatarEmoji: randomAvatar.emoji,
    avatarTitle: randomAvatar.title,
    badgeColor: randomAvatar.badgeColor,
    gradient: randomAvatar.gradient,
    customBio: randomAvatar.description
  };
}
