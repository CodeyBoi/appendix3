// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { GLOBAL_THEME } from "../utils/global-theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppContainer } from "../components/app-container";
import useColorScheme from "../hooks/use-color-scheme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  // Allows user to toggle between light and dark mode by pressing `mod+Y`
  const { colorScheme, toggleColorScheme } = useColorScheme();
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
