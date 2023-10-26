'use client';

import { useState } from 'react';

type GigMenuProps = {
  target: React.ReactNode;
  dropdown: React.ReactNode;
};

const GigMenu = ({ target, dropdown }: GigMenuProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setOpen(!open)}>{target}</div>
      <div className='relative'>
        <div
          className={`absolute rounded shadow z-10 bg-white dark:bg-darkBg transition-opacity -translate-x-full ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {dropdown}
        </div>
      </div>
    </div>
  );
};

export default GigMenu;
