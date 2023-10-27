// src/pages/_app.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'dayjs/locale/sv';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import { AppContainer } from 'components/app-container';
import useColorScheme, { ColorScheme } from 'hooks/use-color-scheme';
import 'styles/globals.css';
import cookieParser from 'utils/cookie-parser';
import { trpc } from 'utils/trpc';
import useKeyDown from 'hooks/use-key-down';
import { bahnschrift } from 'app/fonts';

interface CustomAppProps {
  session: Session | null;
  colorScheme: ColorScheme;
}

const MyApp = ({
  Component,
  pageProps: { session, colorScheme: fetchedColorScheme, ...pageProps },
}: AppProps<CustomAppProps>) => {
  const { toggleColorScheme } = useColorScheme(fetchedColorScheme ?? 'light');
  // Allows user to toggle between light and dark mode by pressing `ctrl+y`
  useKeyDown('ctrl+y', () => toggleColorScheme());

  return (
    <div className={bahnschrift.variable}>
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
    </div>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const { ctx } = context;
  const appProps = await App.getInitialProps(context);
  const cookie = ctx.req?.headers.cookie;
  if (ctx.req?.headers.cookie === undefined) {
    return { ...appProps };
  }

  if (cookie) {
    const cookies = cookieParser(cookie);
    const colorScheme = cookies['tw-color-scheme'];
    appProps.pageProps['colorScheme'] = colorScheme;
  }

  return { ...appProps };
};

export default trpc.withTRPC(MyApp);
