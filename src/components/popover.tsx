'use client';

import { useEffect, useState } from 'react';

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
  closeOnBlur?: boolean;
  opened?: boolean;
  onChange?: (opened: boolean) => void;
};

const Popover = ({
  target,
  popover: dropdown,
  position = 'bottom-right',
  bgColor = 'default',
  closeOnBlur = true,
  opened,
  onChange,
}: PopoverProps) => {
  const [open, setOpen] = useState(opened ?? false);

  useEffect(() => {
    console.log('Opened changed to ', opened, ' from ', open);
    if (opened !== undefined) {
      setOpen(opened);
    }
  }, [opened]);

  useEffect(() => {
    onChange?.(open);
  }, [open]);

  return (
    <div>
      <div className='relative'>
        <div
          tabIndex={0}
          onClick={() => setOpen(!open)}
          onBlur={() => {
            if (closeOnBlur) {
              setTimeout(() => setOpen(false), 100);
            }
          }}
          className='cursor-pointer'
        >
          {target}
        </div>
        <div
          className={`absolute rounded shadow z-10 transition-opacity ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${positionClasses[position]} ${bgColorClasses[bgColor]}`}
        >
          {dropdown}
        </div>
      </div>
    </div>
  );
};

export default Popover;
