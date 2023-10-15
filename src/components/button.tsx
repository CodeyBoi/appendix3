import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leftSection?: React.ReactNode;
};

const Button = ({ disabled, children, leftSection, ...props }: ButtonProps) => {
  if (disabled) {
    return (
      <button
        {...props}
        className='px-5 pb-2.5 pt-2.5 text-neutral-700 dark:text-neutral-300 dark:bg-neutral-700 bg-neutral-300 rounded h-min opacity-50 cursor-not-allowed'
      >
        <div className='flex items-center justify-center space-x-2'>
          {leftSection}
          <div className='font-display whitespace-nowrap'>{children}</div>
        </div>
      </button>
    );
  } else {
    return (
      <button
        {...props}
        className='px-5 pb-2.5 pt-2.5 text-white bg-red-600 rounded hover:bg-red-700 h-min'
      >
        <div className='flex items-center justify-center space-x-2'>
          {leftSection}
          <div className='font-display whitespace-nowrap'>{children}</div>
        </div>
      </button>
    );
  }
};

export default Button;
