import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  href?: string;
  compact?: boolean;
};

type Color = 'red' | 'transparent' | 'navbutton';

const colorVariants = {
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
  ...props
}: ButtonProps) => {
  const classNames = [colorVariants[color]];
  if (disabled) {
    classNames.push('opacity-50 pointer-events-none');
  }

  const buttonElement = (
    <button
      {...props}
      className={
        'rounded h-min transition-colors hover:shadow active:translate-y-px ' +
        classNames.join(' ') +
        ' ' +
        (compact ? 'px-1 py-0.5' : 'px-3 py-2.5') +
        ' ' +
        props.className
      }
    >
      <div className='flex items-center justify-center gap-2 flex-nowrap font-display whitespace-nowrap'>
        {children}
      </div>
    </button>
  );

  return href ? <Link href={href}>{buttonElement}</Link> : buttonElement;
};

export default Button;
