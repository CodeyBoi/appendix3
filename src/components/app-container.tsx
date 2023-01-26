import { AppShell, Navbar } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import AppendixHeader from './header';
import NavbarContent from './navbar';

const AppContainer = ({ children }: { children: ReactElement }) => {
  const session = useSession();
  const router = useRouter();
  const verifiedPage = router.pathname === '/verified'; //? Is this ugly fix?? Please check me Hannes

  return (
    <AppShell
      header={<AppendixHeader />}
      navbar={
        <Navbar width={{ sm: 300, base: 0 }} hidden hiddenBreakpoint='sm'>
          <NavbarContent />
        </Navbar>
      }
      hidden={!session || session.status !== 'authenticated' || verifiedPage}
      padding={24}
    >
      {children}
    </AppShell>
  );
};

export { AppContainer };
