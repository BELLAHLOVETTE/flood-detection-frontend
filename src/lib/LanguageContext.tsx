// src/lib/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, TranslationKey, t as translate } from './translations';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load locale from localStorage after component mounts to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem('flood-watch-lang') as Locale;
    if (saved === 'en' || saved === 'fr') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('flood-watch-lang', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: TranslationKey, replacements?: Record<string, string | number>) => {
    return translate(key, locale, replacements);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
