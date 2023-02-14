import { ColorScheme } from '@mantine/core';
import { setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
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
  return {
    colorScheme,
    toggleColorScheme,
  };
};

export default useColorScheme;
