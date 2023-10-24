'use client';

import { ChangeEvent, InputHTMLAttributes, ReactNode, useState } from 'react';

export type ErrorColor = 'red' | 'white';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label?: string;
  withAsterisk?: boolean;
  onChange?: (value: string) => void;
  icon?: ReactNode;
  description?: string;
  error?: string;
  errorColor?: ErrorColor;
};

const errorColorVariants = {
  red: 'border-red-600 dark:border-red-600 text-red-600 dark:text-red-600',
  white: 'border-white dark:border-white text-white dark:text-white',
};

const floatingLabelClass = 'scale-75 -translate-y-2.5';

const TextInput = ({
  label,
  withAsterisk,
  onChange,
  icon,
  description,
  error,
  errorColor = 'red',
  ...props
}: TextInputProps) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const errorStyle = errorColorVariants[errorColor];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    onChange?.(e.currentTarget.value);
  };

  return (
    <div className='flex flex-col flex-shrink min-w-0'>
      <div
        className={
          'relative flex items-center bg-transparent border rounded shadow-sm h-9 dark:border-neutral-800' +
          (error ? ' ' + errorStyle : '')
        }
      >
        {icon && <div className='absolute px-2'>{icon}</div>}
        <input
          type='text'
          {...props}
          className={
            'flex-grow flex-shrink min-w-0 bg-transparent cursor-text font-display dark:text-gray-300 pb-1 pt-3 pointer-events-auto' +
              (icon ? ' pr-2 pl-9' : ' px-2') +
              ' ' +
              props.className ?? ''
          }
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div className='absolute left-0 flex pointer-events-none'>
          <div className={icon ? 'w-9' : ''} />
          <label
            className={
              'text-white cursor-text transition-transform origin-left duration-100' +
              (focused || value !== '' ? ' ' + floatingLabelClass : '')
            }
          >
            {label}
            {withAsterisk && <span className='text-red-600'>*</span>}
          </label>
        </div>
      </div>
      {description && (
        <span className='-mt-1 text-xs leading-6 tracking-tight text-gray-400'>
          {description}
        </span>
      )}
      {error && <span className={'text-xs' + ' ' + errorStyle}>{error}</span>}
    </div>
  );
};

export default TextInput;
