// src/pages/_app.tsx
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { AppContext, AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { GLOBAL_THEME } from '../utils/global-theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppContainer } from '../components/app-container';
import useColorScheme from '../hooks/use-color-scheme';
import 'dayjs/locale/sv';
import Head from 'next/head';
import App from 'next/app';
import cookieParser from '../utils/cookie-parser';
import { ColorScheme } from '@mantine/core';

interface CustomAppProps {
  session: Session | null;
  colorScheme: ColorScheme;
}

const MyApp = ({
  Component,
  pageProps: { session, colorScheme: fetchedColorScheme, ...pageProps },
}: AppProps<CustomAppProps>) => {
  const { colorScheme, toggleColorScheme } = useColorScheme(
    fetchedColorScheme ?? 'light',
  );
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
          <Head>
            <title>Blindtarmen</title>
            <meta property='og:title' content='Blindtarmen' key='title' />
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1, viewport-fit=cover'
            />
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

MyApp.getInitialProps = async (context: AppContext) => {
  const { ctx } = context;
  const appProps = await App.getInitialProps(context);
  const cookie = ctx.req?.headers.cookie;
  if (cookie) {
    const cookies = cookieParser(cookie);
    const colorScheme = cookies['mantine-color-scheme'];
    appProps.pageProps['colorScheme'] = colorScheme;
  }

  return { ...appProps };
};

export default trpc.withTRPC(MyApp);
