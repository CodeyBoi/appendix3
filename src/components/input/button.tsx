import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

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
  const classNames = [colorClasses[color]];
  if (disabled) {
    classNames.push('opacity-50 pointer-events-none');
  }

  const buttonElement = (
    <button
      type='button'
      {...props}
      className={twMerge(
        'rounded h-min transition-colors hover:shadow active:translate-y-px ' +
          classNames.join(' ') +
          ' ' +
          (compact ? 'px-1 py-0.5' : 'px-3 py-2.5'),
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
