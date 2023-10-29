'use client';

import { useState } from 'react';
import { cn } from '../utils/class-names';
import ActionIcon from './input/action-icon';

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
  popover: React.ReactNode;
  position?: Position;
  bgColor?: BgColor;
  withArrow?: boolean;
};

const Popover = ({
  target,
  popover: dropdown,
  position = 'bottom-right',
  bgColor = 'default',
}: PopoverProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className='relative'>
        <ActionIcon variant='subtle' onClick={() => setOpen(!open)}>
          {target}
        </ActionIcon>
        <div
          className={cn(
            'absolute z-20 rounded p-1 shadow transition-opacity',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
            positionClasses[position],
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
