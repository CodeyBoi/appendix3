export type Language = 'sv' | 'en';
import { useEffect, useState } from 'react';
import { api } from 'trpc/react';

const applyLanguage = (language: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
    const html = document.documentElement;
    if (language === 'sv') {
      html.lang = 'sv';
      html.classList.remove('lang-en');
      html.classList.add('lang-sv');
    } else {
      html.lang = 'en';
      html.classList.remove('lang-sv');
      html.classList.add('lang-en');
    }
  }
};

const useLanguage = (initialLanguage?: Language) => {
  const [languageValue, setLanguageValue] = useState<Language>(
    initialLanguage || 'sv',
  );
  if (initialLanguage) {
    applyLanguage(initialLanguage);
  }
  const mutation = api.corps.setLanguage.useMutation();

  const setLanguage = (newLanguage: Language) => {
    setLanguageValue(newLanguage);
    applyLanguage(newLanguage);
    mutation.mutate(newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = languageValue === 'sv' ? 'en' : 'sv';
    setLanguage(newLanguage);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') as Language | '';
      if (storedLanguage) {
        setLanguageValue(storedLanguage);
        applyLanguage(storedLanguage);
      }
    }
  }, []);

  return {
    language: languageValue,
    setLanguage,
    toggleLanguage,
  };
};

export default useLanguage;
