import { ColorScheme } from '@mantine/core';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

const useColorScheme = (initialColorScheme: ColorScheme) => {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(initialColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    setCookie('mantine-color-scheme', newColorScheme, {
      secure: true,
      sameSite: 'lax',
      httpOnly: true,
    });
  };
  return {
    colorScheme,
    toggleColorScheme,
  };
};

export default useColorScheme;
