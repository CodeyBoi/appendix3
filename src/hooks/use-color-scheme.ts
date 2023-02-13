import { ColorScheme } from '@mantine/core';
import { getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';

// const getColorScheme = () => {
//   const savedColorScheme = getCookie('mantine-color-scheme');

//   if (savedColorScheme !== 'light' && savedColorScheme !== 'dark')
//     return 'dark';
//   return savedColorScheme;
// };

const useColorScheme = (initialColorScheme: ColorScheme) => {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(initialColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    setCookie('mantine-color-scheme', newColorScheme);
  };
  return {
    colorScheme,
    toggleColorScheme,
  };
};

export default useColorScheme;
