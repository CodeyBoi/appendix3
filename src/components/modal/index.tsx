'use client';

import { IconX } from '@tabler/icons-react';
import Divider from 'components/divider';
import ActionIcon from 'components/input/action-icon';
import { ReactNode, useEffect, useState } from 'react';
import { cn } from 'utils/class-names';

export type ModalBackgroundColor = 'white' | 'red' | 'blue' | 'green';

const BG_COLOR_CLASSES: Record<ModalBackgroundColor, string> = {
  white: 'bg-white dark:bg-darkBg',
  red: 'bg-red-600 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
};

interface ModalProps {
  open?: boolean;
  target?: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  bgColor?: ModalBackgroundColor;
  className?: string;
  modalClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  withCloseButton?: boolean;
  startsOpen?: boolean;
  hideBackground?: boolean;
  stayOpenOnBackgroundClicked?: boolean;
}

const Modal = ({
  open: openProp,
  target,
  children,
  title,
  className,
  onFocus,
  onBlur,
  bgColor = 'white',
  withCloseButton = false,
  startsOpen = false,
  hideBackground = false,
  stayOpenOnBackgroundClicked = false,
}: ModalProps) => {
  const [open, setOpenValue] = useState(startsOpen);

  const setOpen = (value: boolean) => {
    if (onFocus && value && !open) {
      onFocus();
    } else if (onBlur && !value && open) {
      onBlur();
    }
    setOpenValue(value);
  };

  useEffect(() => {
    if (openProp === undefined) {
      return;
    }
    setOpen(openProp);
  }, [openProp]);

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
          'fixed left-1/2 top-0 z-20 mt-[68px] max-h-[86vh] min-w-[95vw] -translate-x-1/2 overflow-y-auto rounded p-4 transition-opacity xl:min-w-[720px]',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
          BG_COLOR_CLASSES[bgColor],
        )}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row flex-nowrap items-baseline gap-8'>
            <h3 className='grow'>{title}</h3>
            {withCloseButton && (
              <ActionIcon
                className={cn(
                  ['red', 'blue'].includes(bgColor) && 'text-white',
                )}
                variant='subtle'
                onClick={() => {
                  setOpen(false);
                }}
              >
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
          open
            ? hideBackground
              ? 'opacity-100'
              : 'opacity-50'
            : 'pointer-events-none opacity-0',
          hideBackground && 'bg-neutral-500',
        )}
        onClick={() => {
          if (!stayOpenOnBackgroundClicked) {
            setOpen(false);
          }
        }}
      />
    </div>
  );
};

export default Modal;
