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
import dayjs from 'dayjs';
import { Language } from 'hooks/use-language';
import { isAprilFools, isChristmas } from 'utils/date';
import { range } from 'utils/array';

// Set global locale for dayjs
dayjs.locale('sv');

export const metadata: Metadata = {
  title: 'Blindtarmen',
  description: 'Ett internt verktyg för alla corps',
};

interface RootLayoutProps {
  children: ReactElement;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  // Find the color scheme and language for this session and pass it to the provider
  const corps = await prisma.corps.findUnique({
    where: { id: session.user?.corps?.id },
    select: { colorScheme: true, language: true },
  });
  const colorScheme = (
    isAprilFools() ? 'dark' : corps?.colorScheme
  ) as ColorScheme;
  const language = corps?.language as Language;

  const snowflakes =
    false && isChristmas() ? (
      <>
        {range(8).map((i) => (
          <div key={i} className='snowflake'>
            <div className='inner'>❄️</div>
          </div>
        ))}
      </>
    ) : null;

  return (
    <html
      lang='sv'
      className={cn(
        bahnschrift.variable,
        castelar.variable,
        colorScheme === 'dark' && 'dark',
        'lang-' + language,
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
        {isChristmas() && snowflakes}
        <TRPCReactProvider headers={headers()}>
          <AppProvider
            defaultColorScheme={colorScheme}
            session={session}
            initialLanguage={language}
          >
            <AppShell>{children}</AppShell>
          </AppProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
