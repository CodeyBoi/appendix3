'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactElement } from 'react';
import useColorScheme from 'hooks/use-color-scheme';
import useKeyDown from 'hooks/use-key-down';
import useLanguage, { Language } from 'hooks/use-language';

type AppProviderProps = {
  children: ReactElement;
  defaultColorScheme: 'light' | 'dark';
  session: Session | null;
  initialLanguage: Language;
};

const AppProvider = ({
  children,
  defaultColorScheme,
  session,
  initialLanguage,
}: AppProviderProps) => {
  const { toggleColorScheme } = useColorScheme(defaultColorScheme);
  // Allows user to toggle between light and dark mode by pressing `Control + y`
  useKeyDown('ctrl+y', () => toggleColorScheme());
  useLanguage(initialLanguage);
  return (
    <>
      <SessionProvider session={session}>{children}</SessionProvider>
      <ReactQueryDevtools />
    </>
  );
};

export default AppProvider;
