'use client';

import { MantineProvider } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactElement } from 'react';
import useColorScheme from 'hooks/use-color-scheme';
import { GLOBAL_THEME } from 'utils/global-theme';

type StyleProviderProps = {
  children: ReactElement;
  defaultColorScheme: 'light' | 'dark';
  session: Session | null;
};

const AppProvider = ({
  children,
  defaultColorScheme,
  session,
}: StyleProviderProps) => {
  const { colorScheme, toggleColorScheme } = useColorScheme(defaultColorScheme);
  // Allows user to toggle between light and dark mode by pressing `mod+Y`
  useHotkeys([['mod+Y', () => toggleColorScheme()]]);
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ ...GLOBAL_THEME, colorScheme }}
    >
      <SessionProvider session={session}>{children}</SessionProvider>
      <ReactQueryDevtools />
    </MantineProvider>
  );
};

export default AppProvider;
