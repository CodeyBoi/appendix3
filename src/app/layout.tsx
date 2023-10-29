import 'dayjs/locale/sv';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { ReactElement } from 'react';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import 'styles/globals.css';
import { TRPCReactProvider } from 'trpc/react';
import AppProvider from './app-provider';
import { redirect } from 'next/navigation';
import AppShell from './app-shell';
import { bahnschrift, castelar } from 'app/fonts';
import { prisma } from '../server/db/client';
import { ColorScheme } from 'hooks/use-color-scheme';
import { cn } from 'utils/class-names';

export const metadata: Metadata = {
  title: 'Blindtarmen',
  description: 'Ett internt verktyg för alla corps',
};

type RootLayoutProps = {
  children: ReactElement;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  // Find the color scheme for this session and pass it to the provider
  const colorScheme = (
    await prisma.corps.findUnique({
      where: { id: session.user?.corps?.id },
      select: { colorScheme: true },
    })
  )?.colorScheme as ColorScheme;

  return (
    <html
      lang='sv'
      className={cn(
        bahnschrift.variable,
        castelar.variable,
        colorScheme === 'dark' && 'dark',
      )}
    >
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
      <body className='overflow-y-auto bg-white text-black dark:bg-darkBg dark:text-darkText'>
        <TRPCReactProvider headers={headers()}>
          <AppProvider defaultColorScheme={colorScheme} session={session}>
            <AppShell>{children}</AppShell>
          </AppProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
