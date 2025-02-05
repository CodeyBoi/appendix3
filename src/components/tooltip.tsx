import React, { ReactNode } from 'react';
import { cn } from 'utils/class-names';

export type Position = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  children: ReactNode;
  text: ReactNode;
  position?: Position;
}

const classes: Record<Position, string> = {
  top: 'left-1/2 -translate-x-1/2 bottom-full mb-2',
  right: 'top-1/2 -translate-y-1/2 left-full ml-2',
  bottom: 'left-1/2 -translate-x-1/2 top-full mt-2',
  left: 'top-1/2 -translate-y-1/2 right-full mr-2',
};

const Tooltip = ({ children, text, position = 'top' }: TooltipProps) => {
  return (
    <div className='group relative'>
      {children}
      <div
        className={cn(
          'pointer-events-none absolute z-20 min-w-full max-w-full rounded border bg-white px-2 py-1 text-sm font-thin opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100 dark:border-neutral-800 dark:bg-darkBg lg:w-max lg:max-w-none',
          classes[position],
        )}
      >
        <span className='inline-block w-full break-words'>{text}</span>
      </div>
    </div>
  );
};

export default Tooltip;
