import { ColorScheme } from '@mantine/core';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

const useColorScheme = (initialColorScheme: ColorScheme) => {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(initialColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
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
