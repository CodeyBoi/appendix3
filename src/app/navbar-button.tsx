'use client';

import Burger from 'components/burger';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { isJuly, isPrideMonth } from 'utils/date';

interface NavbarButtonProps {
  children: ReactNode;
  currentDate?: Date;
}

const NavbarButton = ({
  children,
  currentDate = new Date(),
}: NavbarButtonProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Burger
        active={open}
        onClick={() => {
          setOpen(!open);
        }}
        variant={
          isPrideMonth(currentDate)
            ? 'pride'
            : isJuly(currentDate)
            ? 'burger'
            : 'normal'
        }
      />
      <div
        className={
          'absolute top-0 bottom-0 h-screen left-0 z-20 right-0 w-screen duration-200 transition-colors mt-14' +
          (open ? ' bg-black/50' : ' bg-transparent pointer-events-none')
        }
        onClick={() => {
          setOpen(false);
        }}
      />
      <div
        className={
          'absolute top-0 right-0 transition-transform z-30 duration-200 rounded-md shadow-lg mt-14' +
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
