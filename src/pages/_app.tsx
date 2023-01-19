// src/pages/_app.tsx
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { AppProps } from 'next/app';
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
import 'dayjs/locale/sv';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';

const MyApp = (
  props: AppProps & { colorScheme: ColorScheme; session: Session },
) => {
  const { Component, pageProps, session } = props;

  // Allows user to toggle between light and dark mode by pressing `mod+Y`
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme,
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme =
      value || (colorScheme === 'light' ? 'dark' : 'light');
    setColorScheme(newColorScheme);
    setCookie('mantine-color-scheme', newColorScheme);
  };
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

MyApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});

export default trpc.withTRPC(MyApp);
