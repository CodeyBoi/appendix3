import Logo from 'components/logo';
import NavbarButton from './navbar-button';
import { ReactNode } from 'react';
import NavbarContent from 'components/navbar';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header
        className='top-0 box-border flex h-14 w-screen flex-none items-center justify-between bg-red-600 px-4 shadow-md lg:sticky'
        style={{ zIndex: 516 }}
      >
        <Logo />
        {/* Navbar burger */}
        <div className='lg:hidden'>
          <NavbarButton>
            <NavbarContent />
          </NavbarButton>
        </div>
      </header>
      <div className='fixed top-14 w-72 flex-none max-lg:hidden'>
        <NavbarContent />
      </div>
      {children}
    </>
  );
};

export default AppShell;
