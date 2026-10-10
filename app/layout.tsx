import type {Metadata} from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazirmatn',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'زنجیره کلمات | بازی واژه‌سازی و مشاعره فارسی',
  description: 'بازی مهیج و سرگرم‌کننده زنجیره کلمات فارسی با هوش مصنوعی و حالت‌های چندنفره، واژه‌نامه معتبر و افکت‌های صوتی و تصویری پیشرفته.',
  openGraph: {
    title: 'زنجیره کلمات | بازی واژه‌سازی و مشاعره فارسی',
    description: 'بازی مهیج و سرگرم‌کننده زنجیره کلمات فارسی با هوش مصنوعی و حالت‌های چندنفره، واژه‌نامه معتبر و افکت‌های صوتی و تصویری پیشرفته.',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'زنجیره کلمات | بازی واژه‌سازی و مشاعره فارسی',
    description: 'بازی مهیج و سرگرم‌کننده زنجیره کلمات فارسی با هوش مصنوعی و حالت‌های چندنفره.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans selection:bg-cyan-500/30 selection:text-cyan-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

