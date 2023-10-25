import 'dayjs/locale/sv';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { cookies, headers } from 'next/headers';
import { ReactElement } from 'react';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import 'styles/globals.css';
import { TRPCReactProvider } from 'trpc/react';
import AppProvider from './app-provider';
import NavbarBody from 'components/navbar';
import Logo from 'components/logo';
import { redirect } from 'next/navigation';
import NavbarButton from './navbar-button';

export const metadata: Metadata = {
  title: 'Blindtarmen',
  description: 'Ett internt verktyg för alla corps',
};

type RootLayoutProps = {
  children: ReactElement;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const cookiesList = cookies();
  const colorScheme =
    cookiesList.get('tw-color-scheme')?.value === 'dark' ? 'dark' : 'light';
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
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
      <body className='overflow-y-auto text-black bg-white dark:bg-darkBg dark:text-darkText'>
        <TRPCReactProvider headers={headers()}>
          <AppProvider defaultColorScheme={colorScheme} session={session}>
            <>
              <header
                className='box-border sticky top-0 flex items-center justify-between flex-none w-full bg-red-600 shadow-md h-14'
                style={{ zIndex: 516 }}
              >
                <div className='p-3'>
                  <Logo />
                </div>
                {/* Navbar burger */}
                <div className='lg:hidden'>
                  <NavbarButton>
                    <NavbarBody />
                  </NavbarButton>
                </div>
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
