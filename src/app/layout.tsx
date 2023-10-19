import 'dayjs/locale/sv';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { ReactElement } from 'react';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import '../styles/globals.css';
import { TRPCReactProvider } from '../trpc/react';
import AppProvider from './app-provider';

export const metadata: Metadata = {
  title: 'Blindtarmen',
  description: 'Ett internt verktyg för alla corps',
};

type RootLayoutProps = {
  children: ReactElement;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const defaultColorScheme = 'light'; // TODO: Fix later, right now it's always light on first load/refresh
  const session = await getServerSession(authOptions);
  return (
    <html lang='sv'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover'
        />
        <meta charSet='utf-8' />
        <meta name='description' content='Ett internt verktyg för alla corps' />
        <link rel='manifest' href='/manifest.json' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#ce0c00' />
        <meta name='msapplication-TileColor' content='#ce0c00' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#B80900'></meta>
      </head>
      <body>
        <TRPCReactProvider headers={headers()}>
          <AppProvider
            defaultColorScheme={defaultColorScheme}
            session={session}
          >
            {children}
          </AppProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
