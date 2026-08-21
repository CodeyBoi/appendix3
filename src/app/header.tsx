'use client';

import Logo from 'components/logo';
import { ReactNode, useEffect, useState } from 'react';
import NavbarButton from './navbar-button';
import { cn } from 'utils/class-names';

interface HeaderProps {
  navbarContent: ReactNode;
}

const Header = ({ navbarContent }: HeaderProps) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [navbarIsClosing, setNavbarIsClosing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNavbarIsClosing(false);
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [navbarIsClosing]);

  return (
    <header
      className={cn(
        'top-0 box-border flex h-14 w-screen flex-none items-center justify-between bg-red-600 px-4 shadow-md transition-all lg:sticky',
        (navbarOpen || navbarIsClosing) && 'sticky',
      )}
      style={{ zIndex: 516 }}
    >
      <Logo />
      {/* Navbar burger */}
      <div className='lg:hidden'>
        <NavbarButton
          open={navbarOpen}
          setOpen={(open) => {
            setNavbarOpen(open);
            setNavbarIsClosing(true);
          }}
        >
          {navbarContent}
        </NavbarButton>
      </div>
    </header>
  );
};

export default Header;
