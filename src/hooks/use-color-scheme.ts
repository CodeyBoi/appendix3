export type ColorScheme = 'light' | 'dark';
import { useState } from 'react';
import { api } from 'trpc/react';
import { isAprilFools } from 'utils/date';

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
  const initColor = initialColorScheme ?? 'light';
  const [colorScheme, setColorScheme] = useState<ColorScheme>(initColor);
  if (initialColorScheme) {
    applyScheme(initialColorScheme);
  }
  const mutation = api.corps.setColorScheme.useMutation();
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    mutation.mutate(newColorScheme);
    applyScheme(newColorScheme);
  };

  return {
    colorScheme: isAprilFools() ? 'dark' : colorScheme,
    toggleColorScheme,
  };
};

export default useColorScheme;
