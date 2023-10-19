'use client';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactElement } from 'react';
import { AppContainer } from '../components/app-container';
import useColorScheme from '../hooks/use-color-scheme';
import { GLOBAL_THEME } from '../utils/global-theme';

type StyleProviderProps = {
  children: ReactElement;
  defaultColorScheme: ColorScheme;
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
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ ...GLOBAL_THEME, colorScheme }}
      >
        <SessionProvider session={session}>
          <AppContainer>{children}</AppContainer>
        </SessionProvider>
        <ReactQueryDevtools />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default AppProvider;
