'use client';

import { IconX } from '@tabler/icons-react';
import Divider from 'components/divider';
import ActionIcon from 'components/input/action-icon';
import { ReactNode, useState } from 'react';
import { cn } from 'utils/class-names';

type ModalProps = {
  target: ReactNode;
  children: ReactNode;
  title?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  withCloseButton?: boolean;
};

const Modal = ({
  target,
  children,
  title,
  className,
  onFocus,
  onBlur,
  withCloseButton = false,
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
          'fixed left-1/2 top-1/2 z-20 max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded bg-white p-4 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row flex-nowrap gap-8'>
            <h3 className='grow'>{title}</h3>
            {withCloseButton && (
              <ActionIcon variant='subtle' onClick={() => setOpen(false)}>
                <IconX />
              </ActionIcon>
            )}
          </div>
          <div className='-mx-2'>
            <Divider />
          </div>
          {children}
        </div>
      </div>
      <div
        className={cn(
          'fixed right-0 top-0 z-10 h-screen w-screen bg-black transition-opacity',
          open ? 'opacity-50' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
      />
    </div>
  );
};

export default Modal;
