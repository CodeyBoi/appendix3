import 'dayjs/locale/sv';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { ReactElement } from 'react';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import '../styles/globals.css';
import { TRPCReactProvider } from '../trpc/react';
import AppProvider from './app-provider';
import NavbarBody from 'components/navbar';
import { IconMenu2 } from '@tabler/icons';
import Logo from 'components/logo';

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
      <body className='overflow-y-auto'>
        <TRPCReactProvider headers={headers()}>
          <AppProvider
            defaultColorScheme={defaultColorScheme}
            session={session}
          >
            <>
              <header
                className='box-border sticky top-0 flex items-center justify-between flex-none w-full bg-red-600 shadow-md h-14'
                style={{ zIndex: 516 }}
              >
                <div className='pl-3'>
                  <Logo />
                </div>
                {/* Navbar button */}
                <button className='p-1 pr-3 text-white rounded lg:hidden hover:bg-red-600/10'>
                  <IconMenu2 />
                </button>
              </header>
              <div className='fixed flex-none w-72 top-14 max-lg:hidden'>
                <NavbarBody />
              </div>
              <div className='p-6 lg:ml-72'>{children}</div>
            </>
          </AppProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
