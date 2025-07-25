import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';
import { cn } from 'utils/class-names';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  href?: string;
  compact?: boolean;
  fullWidth?: boolean;
};

type Color = 'red' | 'transparent' | 'navbutton' | 'no-fill';

const colorClasses: Record<Color, string> = {
  red: 'bg-red-600 hover:bg-red-700 text-white',
  transparent: 'bg-transparent text-gray-700 dark:text-gray-300',
  navbutton: 'bg-transparent text-white',
  'no-fill': 'border-2 border-red-600 text-red-600',
};

const Button = ({
  color = 'red',
  disabled,
  children,
  href,
  compact = false,
  className,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const buttonElement = (
    <button
      type='button'
      {...props}
      className={cn(
        'h-min rounded transition-colors hover:shadow active:translate-y-px',
        colorClasses[color],
        compact ? 'px-1 py-0.5' : 'px-3 py-2.5',
        disabled && 'pointer-events-none opacity-50',
        fullWidth ? 'w-full' : 'max-w-max',
        className,
      )}
    >
      <div className='flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap font-display'>
        {children}
      </div>
    </button>
  );

  return href ? (
    <Link className={fullWidth ? 'w-full' : 'max-w-max'} href={href}>
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  );
};

export default Button;
