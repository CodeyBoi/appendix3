import { AppShell, Navbar } from "@mantine/core";
import { useSession } from "next-auth/react";
import { ReactElement } from "react";
import AppendixHeader from "./header";
import NavbarContent from "./navbar";

const AppContainer = ({ children }: { children: ReactElement }) => {
  const session = useSession();

  return (
    <AppShell
      header={<AppendixHeader />}
      navbar={
        <Navbar width={{ sm: 300, base: 0 }} hidden hiddenBreakpoint="sm">
          <NavbarContent />
        </Navbar>
      }
      hidden={!session || session.status !== "authenticated"}
      padding={24}
    >
      {children}
    </AppShell>
  );
};

export { AppContainer };
