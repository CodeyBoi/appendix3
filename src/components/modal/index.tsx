'use client';

import { ReactNode, useState } from 'react';
import { cn } from 'utils/class-names';

type ModalProps = {
  target: ReactNode;
  className?: string;
  children: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
};

const Modal = ({
  target,
  className,
  children,
  onFocus,
  onBlur,
}: ModalProps) => {
  const [open, setOpenValue] = useState(false);

  const setOpen = (value: boolean) => {
    if (onFocus && value && !open) {
      onFocus();
    } else if (onBlur && !value && open) {
      onBlur();
    }
    setOpenValue(value);
  };

  const handleClick = () => {
    if (!open) {
      setOpen(true);
    }
  };

  return (
    <div
      className={cn(!open && 'cursor-pointer', className)}
      onClick={handleClick}
    >
      {target}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-20 -translate-x-1/2 translate-y-1/2 transform overflow-y-auto rounded p-4 shadow transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {children}
      </div>
      {open && (
        <div
          className='fixed right-0 top-0 z-10 h-screen w-screen bg-black/50'
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Modal;
