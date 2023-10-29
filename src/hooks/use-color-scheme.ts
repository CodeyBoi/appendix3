export type ColorScheme = 'light' | 'dark';
import { useState } from 'react';
import { api } from 'trpc/react';

const applyScheme = (scheme: ColorScheme) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('colorScheme', scheme);
    if (scheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

const useColorScheme = (initialColorScheme?: ColorScheme) => {
  const initColor = (sessionStorage.getItem('colorScheme') ??
    initialColorScheme ??
    'light') as ColorScheme;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(initColor);

  const mutation = api.corps.setColorScheme.useMutation();
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    mutation.mutate(newColorScheme);
    applyScheme(newColorScheme);
  };

  /* April Fools */
  const date = new Date();
  const isAprilFirst = date.getDate() === 1 && date.getMonth() === 3;
  /* April Fools */

  return {
    colorScheme: isAprilFirst ? 'dark' : colorScheme,
    toggleColorScheme,
  };
};

export default useColorScheme;
