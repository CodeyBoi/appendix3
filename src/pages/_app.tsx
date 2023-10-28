// src/pages/_app.tsx
import 'dayjs/locale/sv';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import 'styles/globals.css';
import { trpc } from 'utils/trpc';
import { bahnschrift } from 'app/fonts';

interface CustomAppProps {
  session: Session | null;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<CustomAppProps>) => {
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
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  return { ...appProps };
};

export default trpc.withTRPC(MyApp);
