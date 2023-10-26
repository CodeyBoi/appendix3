'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import NavbarButton from 'app/navbar-button';
import Logo from './logo';

const NavbarBody = dynamic(() => import('./navbar/react'));

const AppContainer = ({ children }: { children: ReactElement }) => {
  const session = useSession();
  const pathname = usePathname();
  const hideShell =
    pathname === '/login' ||
    pathname === '/verified' ||
    pathname === '/verify-request' ||
    !session;

  return (
    <>
      <header
        className={
          'box-border sticky top-0 flex items-center justify-between flex-none w-full bg-red-600 shadow-md h-14' +
          (hideShell ? ' hidden' : '')
        }
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
      <div
        className={
          'fixed flex-none w-72 top-14 max-lg:hidden' +
          (hideShell ? ' hidden' : '')
        }
      >
        <NavbarBody />
      </div>
      <div className='p-6 lg:ml-72'>{children}</div>
    </>
  );
};

export { AppContainer };
