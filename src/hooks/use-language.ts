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
    } else if (language === 'en') {
      html.lang = 'en';
      html.classList.remove('lang-sv');
      html.classList.add('lang-en');
    }
  }
};

const useLanguage = (initialLanguage?: Language) => {
  const [language, setLanguage] = useState<Language>(initialLanguage || 'sv');
  if (initialLanguage) {
    applyLanguage(initialLanguage);
  }
  const mutation = api.corps.setLanguage.useMutation();
  const toggleLanguage = (value?: Language) => {
    const newLanguage = value || (language === 'sv' ? 'en' : 'sv');
    setLanguage(newLanguage);
    applyLanguage(language);
    mutation.mutate(language);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') as Language;
      if (storedLanguage) {
        setLanguage(storedLanguage);
        applyLanguage(storedLanguage);
      }
    }
  }, []);

  return {
    language,
    toggleLanguage,
  };
};

export default useLanguage;
