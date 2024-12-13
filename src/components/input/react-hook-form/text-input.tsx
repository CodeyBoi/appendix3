'use client';

import React, { InputHTMLAttributes, ReactNode, useState } from 'react';
import { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { cn } from 'utils/class-names';

export type ErrorColor = 'red' | 'white';
export type TextInputVariant = 'default' | 'login';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>
  , 'name'>

   & {
  name: string;
  register: UseFormRegister<FieldValues>;
  label?: ReactNode;
  withAsterisk?: boolean;
  icon?: ReactNode;
  description?: string;
  variant?: TextInputVariant;
  error?: string;
  errorColor?: ErrorColor;
  registerOptions?: RegisterOptions;
};

const errorColorVariants = {
  red: 'border-red-600 dark:border-red-600 text-red-600 dark:text-red-600',
  white: 'border-white dark:border-white text-white dark:text-white',
};

const TextInput = ({
  label,
  withAsterisk,
  icon,
  description,
  variant = 'default',
  error,
  errorColor = 'red',
  onFocus: propOnFocus,
  onBlur: propOnBlur,
  name,
  register,
  registerOptions,
  ...props
}: TextInputProps) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const errorStyle = errorColorVariants[errorColor];

  const {
    onChange: formOnChange,
    onBlur: formOnBlur,
    ...registerReturn
  } = register(name, registerOptions);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    formOnChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    propOnFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    propOnBlur?.(e);
    formOnBlur?.(e);
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
          className={cn(
            'pointer-events-auto h-10 min-w-0 flex-shrink grow cursor-text rounded bg-transparent pb-2 pt-3 font-display dark:text-darkText',
            icon ? ' pl-9 pr-2' : ' px-2',
            props.className,
          )}
          {...registerReturn}
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
