'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dictionary, LOCALES, LOCALE_HTML_LANG, type Locale, type TranslationKey } from './dictionary';

const STORAGE_KEY = 'sathimate.locale';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  /**
   * Server aur pehle client render — dono par 'en'. Agar yahan localStorage
   * seedha padh lete to server ka HTML aur client ka HTML alag hote aur React
   * hydration error deta. Isliye saved locale useEffect mein lagti hai.
   */
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
      else if (navigator.language?.startsWith('hi')) setLocaleState('hinglish');
    } catch {
      /* private mode mein localStorage block ho sakta hai — English hi rahegi */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML_LANG[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      // Hinglish mein key na ho to English fallback — app kabhi khaali
      // string nahi dikhayegi.
      const table = dictionary[locale] as Record<string, string>;
      return table[key] ?? dictionary.en[key] ?? key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

/** Shortcut — sirf translate karna ho to. */
export function useT() {
  return useLanguage().t;
}
