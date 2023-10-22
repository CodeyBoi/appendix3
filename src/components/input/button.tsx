import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  href?: string;
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
  ...props
}: ButtonProps) => {
  const classNames = [colorVariants[color]];
  if (disabled) {
    classNames.push('opacity-50 cursor-not-allowed');
  }

  const buttonElement = (
    <button
      {...props}
      className={
        'px-3 py-2.5 rounded h-min transition-colors hover:shadow ' +
        classNames.join(' ') +
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
