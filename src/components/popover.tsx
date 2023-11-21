'use client';

import { useState } from 'react';
import { cn } from '../utils/class-names';

type Position =
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'
  | 'left-bottom'
  | 'top'
  | 'top-right';

const positionClasses: Record<Position, string> = {
  'bottom-right': '',
  bottom: '-translate-x-1/2 left-1/2',
  'bottom-left': 'right-0',
  'left-bottom': 'top-0 right-full',
  top: 'bottom-full left-1/2 -translate-x-1/2',
  'top-right': 'bottom-full',
};

type BgColor = 'red' | 'default';

const bgColorClasses: Record<BgColor, string> = {
  red: 'bg-red-600 text-white',
  default: 'bg-white dark:bg-darkBg',
};

type PopoverProps = {
  target: React.ReactNode;
  targetClassName?: string;
  children: React.ReactNode;
  position?: Position;
  bgColor?: BgColor;
  withArrow?: boolean;
  center?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

const Popover = ({
  target,
  targetClassName,
  children: dropdown,
  position = 'bottom-right',
  bgColor = 'default',
  center = false,
  onFocus,
  onBlur,
}: PopoverProps) => {
  const [open, setOpenValue] = useState(false);

  const setOpen = (value: boolean) => {
    if (onFocus && value && !open) {
      onFocus();
    } else if (onBlur && !value && open) {
      onBlur();
    }
    setOpenValue(value);
  };

  return (
    <div
      className={cn('cursor-pointer', targetClassName)}
      onClick={() => {
        if (!open) {
          setOpen(true);
        }
      }}
    >
      {target}
      <div className='relative'>
        <div
          className={cn(
            'z-20 overflow-y-auto rounded p-1 shadow transition-opacity',
            center
              ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
              : 'absolute ' + positionClasses[position],
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
            bgColorClasses[bgColor],
          )}
        >
          {dropdown}
        </div>
        {open && (
          <div
            className='fixed right-0 top-0 z-10 h-screen w-screen'
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Popover;
