// src/components/LanguageToggle.tsx
'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex p-0.5 bg-gray-100 rounded-lg border border-gray-200/50">
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
          locale === 'en'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('fr')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
          locale === 'fr'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        FR
      </button>
    </div>
  );
}
