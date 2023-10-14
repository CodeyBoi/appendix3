import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leftSection?: React.ReactNode;
};

const Button = ({ disabled, children, leftSection, ...props }: ButtonProps) => {
  if (disabled) {
    return (
      <button
        {...props}
        className='flex align-top space-x-2 px-5 pb-2.5 pt-2.5 text-neutral-700 dark:text-neutral-300 dark:bg-neutral-700 bg-neutral-300 rounded whitespace-nowrap font-display h-min opacity-50 cursor-not-allowed'
      >
        {leftSection}
        {children}
      </button>
    );
  } else {
    return (
      <button
        {...props}
        className='flex align-top space-x-2 px-5 pb-2.5 pt-2.5 text-white bg-red-600 rounded hover:bg-red-700 whitespace-nowrap font-display h-min'
      >
        {leftSection}
        {children}
      </button>
    );
  }
};

export default Button;
