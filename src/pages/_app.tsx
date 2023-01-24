// src/pages/_app.tsx
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { AppProps, AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { GLOBAL_THEME } from '../utils/global-theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppContainer } from '../components/app-container';
import useColorScheme from '../hooks/use-color-scheme';
import 'dayjs/locale/sv';
import Head from 'next/head';
import { setCookie, getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

const MyApp = (props: AppProps & { session: Session }) => {
  const { Component, pageProps, session } = props;

  const [mounted, setMounted] = useState(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  // Allows user to toggle between light and dark mode by pressing `mod+Y`

  useHotkeys([['mod+Y', () => toggleColorScheme()]]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
          <Head>
            <title>Blindtarmen</title>
            <meta property='og:title' content='Blindtarmen' key='title' />
          </Head>
          <AppContainer>
            <Component {...pageProps} />
          </AppContainer>
        </SessionProvider>
        <ReactQueryDevtools />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
