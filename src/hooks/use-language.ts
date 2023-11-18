export type Language = 'sv' | 'en';
import { useState } from 'react';
import { api } from 'trpc/react';

const applyLanguage = (language: Language) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('language', language);
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
  const initLanguage = (sessionStorage?.getItem('language') ??
    initialLanguage ??
    'sv') as Language;
  const [language, setLanguage] = useState<Language>(initLanguage);

  const mutation = api.corps.setLanguage.useMutation();
  const toggleLanguage = (value?: Language) => {
    const newLanguage = value || (language === 'sv' ? 'en' : 'sv');
    setLanguage(newLanguage);
    mutation.mutate(newLanguage);
    applyLanguage(newLanguage);
  };

  return {
    language,
    toggleLanguage,
  };
};

export default useLanguage;
