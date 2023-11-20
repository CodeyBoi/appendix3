import Logo from 'components/logo';
import NavbarBody from 'components/navbar';
import NavbarButton from './navbar-button';
import { ReactNode } from 'react';
import LanguageSwitcher from './language-switcher';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header
        className='sticky top-0 box-border flex h-14 w-full flex-none items-center justify-between bg-red-600 shadow-md'
        style={{ zIndex: 516 }}
      >
        <div className='p-3'>
          <Logo />
        </div>
        <div className='flex items-center gap-4 px-4'>
          <LanguageSwitcher />
          {/* Navbar burger */}
          <div className='lg:hidden'>
            <NavbarButton>
              <NavbarBody />
            </NavbarButton>
          </div>
        </div>
      </header>
      <div className='fixed top-14 w-72 flex-none max-lg:hidden'>
        <NavbarBody />
      </div>
      <div className='p-6 lg:ml-72'>{children}</div>
    </>
  );
};

export default AppShell;
