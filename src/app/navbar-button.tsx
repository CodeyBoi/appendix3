'use client';

import Burger from 'components/burger';
import { useState } from 'react';

const NavbarButton = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Burger active={open} onClick={() => setOpen(!open)} />
      <div
        className={
          'fixed top-0 bottom-0 left-0 z-10 right-0 w-screen transition-colors mt-14' +
          (open ? ' bg-black/50' : '')
        }
        style={{ height: 'calc(100vh - 56px)' }}
        onClick={() => setOpen(false)}
      />
      <div
        className={
          'fixed top-0 right-0 transition-transform z-20 duration-200 rounded-md shadow-lg mt-14' +
          (open ? '' : ' ' + 'translate-x-72')
        }
      >
        <div
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='user-menu'
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default NavbarButton;
