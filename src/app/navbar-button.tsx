'use client';

import Burger from 'components/burger';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { cn } from 'utils/class-names';
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
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setIsClosing(true);
    const timeout = setTimeout(() => {
      setIsClosing(false);
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

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
          'absolute inset-0 z-20 mt-14 h-[100vh-56px] w-screen transition-colors duration-200',
          open ? 'bg-black/50' : 'pointer-events-none bg-transparent',
          (open || isClosing) && 'h-screen',
        )}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div
        className={cn(
          'absolute right-0 top-0 z-30 mt-14 rounded-md shadow-lg transition-transform duration-200',
          !open && 'translate-x-72',
          !open && !isClosing && 'fixed',
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
