'use client';

import Burger from 'components/burger';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { cn } from 'utils/class-names';
import { isJuly, isPrideMonth } from 'utils/date';

interface NavbarButtonProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  children: ReactNode;
  currentDate?: Date;
}

const NavbarButton = ({
  open,
  setOpen,
  children,
  currentDate = new Date(),
}: NavbarButtonProps) => {
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
        className={cn(
          'fixed inset-0 z-20 mt-14 h-screen w-screen transition-colors duration-200',
          open ? 'bg-black/50' : 'pointer-events-none bg-transparent',
        )}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-30 mt-14 rounded-md shadow-lg transition-transform duration-200',
          !open && 'translate-x-72',
        )}
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
