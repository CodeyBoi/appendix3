import Logo from 'components/logo';
import NavbarBody from 'components/navbar';
import NavbarButton from './navbar-button';
import { ReactNode } from 'react';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header
        className='box-border sticky top-0 flex items-center justify-between flex-none w-full bg-red-600 shadow-md h-14'
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
      <div className='fixed flex-none w-72 top-14 max-lg:hidden'>
        <NavbarBody />
      </div>
      <div className='p-6 lg:ml-72'>{children}</div>
    </>
  );
};

export default AppShell;
