import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: string;
  bg?: string;
  href?: string;
};

const Button = ({
  color = 'white',
  bg = 'red',
  disabled,
  children,
  href,
  ...props
}: ButtonProps) => {
  const classNames = [];
  if (disabled) {
    classNames.push(
      `opacity-50 cursor-not-allowed bg-${bg}-300 text-${color}-700 dark:bg-${bg}-700 dark:text-${color}-300`,
    );
  } else {
    classNames.push(`bg-${bg}-600 hover:bg-${bg}-700 text-${color}`);
  }

  const buttonElement = (
    <button
      {...props}
      className={
        'px-3 py-2.5 rounded h-min transition-colors ' +
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
