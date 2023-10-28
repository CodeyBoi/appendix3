'use client';

import { useState } from 'react';

type Position =
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'
  | 'left-bottom'
  | 'top';

type GigMenuProps = {
  target: React.ReactNode;
  dropdown: React.ReactNode;
  position?: Position;
  withArrow?: boolean;
};

const positionClasses: Record<Position, string> = {
  'bottom-right': '',
  bottom: '-translate-x-1/2 left-1/2',
  'bottom-left': 'right-0',
  'left-bottom': 'top-0 right-full',
  top: 'bottom-full left-1/2 -translate-x-1/2',
};

const Popover = ({
  target,
  dropdown,
  position = 'bottom-right',
}: GigMenuProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className='relative'>
        <div
          onClick={() => setOpen(!open)}
          // onBlur={() => setTimeout(() => setOpen(false), 100)}
          className='cursor-pointer'
        >
          {target}
        </div>
        <div
          className={`absolute rounded shadow z-10 bg-white dark:bg-darkBg transition-opacity ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${positionClasses[position]}`}
        >
          {dropdown}
        </div>
      </div>
    </div>
  );
};

export default Popover;
