'use client';

import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { cn } from 'utils/class-names';

export type ErrorColor = 'red' | 'white';
export type TextInputVariant = 'default' | 'login';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'defaultValue' | 'value'
> & {
  label?: React.ReactNode;
  withAsterisk?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  description?: string;
  variant?: TextInputVariant;
  error?: string;
  errorColor?: ErrorColor;
  value?: string;
  defaultValue?: string;
};

const errorColorVariants = {
  red: 'border-red-600 dark:border-red-600 text-red-600 dark:text-red-600',
  white: 'border-white dark:border-white text-white dark:text-white',
};

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
  onFocus,
  onBlur,
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className='flex min-w-0 shrink flex-col pt-2'>
      <div
        className={cn(
          'relative flex h-10 items-center rounded border bg-transparent shadow-sm dark:border-neutral-800',
          error && errorStyle,
        )}
      >
        {icon && <div className='absolute px-2'>{icon}</div>}
        <input
          type='text'
          {...props}
          value={value}
          className={cn(
            'pointer-events-auto h-10 min-w-0 flex-shrink grow cursor-text rounded bg-transparent pb-2 pt-3 font-display dark:text-darkText',
            icon ? ' pl-9 pr-2' : ' px-2',
            props.className,
          )}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div className='pointer-events-none absolute left-0 flex'>
          <div className={icon ? 'w-9' : 'w-2'} />
          <label
            className={cn(
              'flex origin-left cursor-text gap-1 px-1 text-sm text-neutral-500 transition-transform duration-100',
              (focused || value !== '') && '-translate-y-5',
              (focused || value !== '') && icon && '-translate-x-7',
              variant === 'login' ? 'text-white' : 'bg-white dark:bg-darkBg',
            )}
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
      {error && <span className={cn('text-xs', errorStyle)}>{error}</span>}
    </div>
  );
};

export default TextInput;
