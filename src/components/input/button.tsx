import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';
import { cn } from 'utils/class-names';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  href?: string;
  compact?: boolean;
};

type Color = 'red' | 'transparent' | 'navbutton';

const colorClasses: Record<Color, string> = {
  red: 'bg-red-600 hover:bg-red-700 text-white',
  transparent: 'bg-transparent text-gray-700 dark:text-gray-300',
  navbutton: 'bg-transparent text-white',
};

const Button = ({
  color = 'red',
  disabled,
  children,
  href,
  compact = false,
  className,
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
        className,
      )}
    >
      <div className='flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap font-display'>
        {children}
      </div>
    </button>
  );

  return href ? <Link href={href}>{buttonElement}</Link> : buttonElement;
};

export default Button;
