// src/components/LanguageToggle.tsx
'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex p-0.5 rounded-full" style={{ background: 'var(--fw-mist)' }}>
      <button
        onClick={() => setLocale('en')}
        className="px-2.5 py-1 text-[11.5px] font-semibold rounded-full transition-all duration-200"
        style={locale === 'en'
          ? { background: '#fff', color: 'var(--fw-deep)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }
          : { color: 'var(--fw-ink)', opacity: 0.5 }}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('fr')}
        className="px-2.5 py-1 text-[11.5px] font-semibold rounded-full transition-all duration-200"
        style={locale === 'fr'
          ? { background: '#fff', color: 'var(--fw-deep)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }
          : { color: 'var(--fw-ink)', opacity: 0.5 }}
      >
        FR
      </button>
    </div>
  );
}