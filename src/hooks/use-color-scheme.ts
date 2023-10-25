type ColorScheme = 'light' | 'dark';
import { useState } from 'react';

const useColorScheme = (initialColorScheme: ColorScheme) => {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(initialColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    if (typeof window !== 'undefined') {
      if (newColorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  // trpc.corps.setColorScheme.useQuery(colorScheme);

  if (typeof window !== 'undefined') {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

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
