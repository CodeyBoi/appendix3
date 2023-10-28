export type ColorScheme = 'light' | 'dark';
import { useState } from 'react';
import { trpc } from 'utils/trpc';

const applyScheme = (scheme: ColorScheme) => {
  if (typeof window !== 'undefined') {
    if (scheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

const useColorScheme = (initialColorScheme?: ColorScheme) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    initialColorScheme ?? 'light',
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    applyScheme(newColorScheme);
  };
  trpc.corps.setColorScheme.useQuery(colorScheme);

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
