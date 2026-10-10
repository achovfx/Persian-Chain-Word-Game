import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();

    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: 'کلمه معتبری ارسال نشده است.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        explanation: 'برای دیدن توضیحات بیشتر، کلید هوش مصنوعی را در تنظیمات فعال کنید.',
        word
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `شما یک فرهنگ‌نویس و زبان‌شناس متخصص زبان و ادب فارسی هستید. لطفاً برای واژه «${word}» اطلاعات زیر را در قالب پاسخ کوتاه و دلنشین فارسی تهیه کنید:
1. ریشه یا دسته واژه (اسم، صفت، فعل و...)
2. معنی دقیق و روان در ادبیات و زبان روزمره
3. یک بیت شعر زیبا یا جمله نمونه با این واژه
پاسخ مختصر و در ۲ الی ۳ خط باشد.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    return NextResponse.json({
      word,
      explanation: response.text || 'معنایی یافت نشد.'
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'خطای سرور';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
