'use client';

import React, { InputHTMLAttributes, useEffect, useState } from 'react';

export type ErrorColor = 'red' | 'white';
export type TextInputVariant = 'default' | 'login';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'defaultValue'
> & {
  label?: string;
  withAsterisk?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  description?: string;
  variant?: TextInputVariant;
  error?: string;
  errorColor?: ErrorColor;
  defaultValue?: string;
  value?: string;
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
  variant = 'default',
  error,
  errorColor = 'red',
  defaultValue,
  value: propValue,
  ...props
}: TextInputProps) => {
  const [value, setValue] = useState('');
  if (defaultValue && value === '') {
    setValue(defaultValue);
    onChange?.(defaultValue);
  }

  useEffect(() => {
    if (propValue) {
      setValue(propValue);
    }
  }, [propValue]);

  const [focused, setFocused] = useState(false);

  const errorStyle = errorColorVariants[errorColor];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    onChange?.(e.currentTarget.value);
  };

  return (
    <div className='flex flex-col self-end flex-shrink min-w-0'>
      <div
        className={
          'relative flex items-center bg-transparent border rounded shadow-sm h-11 dark:border-neutral-800' +
          (error ? ' ' + errorStyle : '')
        }
      >
        {icon && <div className='absolute px-2'>{icon}</div>}
        <input
          value={propValue ?? value}
          type='text'
          {...props}
          className={
            'flex-grow flex-shrink min-w-0 bg-transparent cursor-text font-display dark:text-gray-300 pb-1 pt-5 pointer-events-auto' +
              (icon ? ' pr-2 pl-9' : ' px-2') +
              ' ' +
              props.className ?? ''
          }
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div className='absolute left-0 flex pointer-events-none'>
          <div className={icon ? 'w-9' : 'w-2'} />
          <label
            className={
              'flex gap-1 cursor-text transition-transform origin-left duration-100' +
              (focused || value !== ''
                ? ' ' + floatingLabelClass
                : ' ' + 'text-gray-500') +
              (variant === 'login' ? ' ' + 'text-white' : '')
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
