import { AppShell, Navbar } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';

const AppendixHeader = dynamic(() => import('./header'));
const NavbarContent = dynamic(() => import('./navbar'));

const AppContainer = ({ children }: { children: ReactElement }) => {
  const session = useSession();
  const pathname = usePathname();
  const verifiedPage = pathname === '/verified'; //? Is this ugly fix?? Please check me Hannes

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
