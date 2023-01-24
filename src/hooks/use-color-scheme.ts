import { ColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';

const getColorScheme = () => {
  const savedColorScheme = getCookie('mantine-color-scheme');

  if (savedColorScheme !== 'light' && savedColorScheme !== 'dark')
    return 'light';
  return savedColorScheme;
};

const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getColorScheme());
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
