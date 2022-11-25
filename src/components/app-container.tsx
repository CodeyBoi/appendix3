import { AppShell } from "@mantine/core";
import { useSession } from "next-auth/react";
import { ReactElement } from "react";
import AppendixHeader from "./header";

const AppContainer = ({ children }: { children: ReactElement }) => {
  const session = useSession();
  return (
    <AppShell
      header={<AppendixHeader />}
      hidden={!session || session.status !== 'authenticated'}
      padding={24}
    >
      {children}
    </AppShell>
  );
}

export { AppContainer };
