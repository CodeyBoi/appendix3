// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ColorSchemeProvider, MantineProvider, ColorScheme, AppShell } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { GLOBAL_THEME } from "../utils/global-theme";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppendixHeader from "../components/header";
import { AppContainer } from "../components/app-container";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  // const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  // const toggleColorScheme = (value?: ColorScheme) => {
  //   setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  // };

  // Allows user to toggle between light and dark mode by pressing `mod+J`
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  }
  useHotkeys([['mod+Y', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...GLOBAL_THEME, colorScheme }}>
        <SessionProvider session={session}>
          <AppContainer>
            <Component {...pageProps} />
          </AppContainer>
        </SessionProvider>
        <ReactQueryDevtools />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
