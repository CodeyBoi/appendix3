'use client';

import { InputHTMLAttributes, useEffect, useState } from 'react';
import { cn } from '../../utils/class-names';

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'checked' | 'defaultChecked' | 'value'
> & {
  onChange?: ((value: boolean) => void) | (() => void);
  defaultChecked?: boolean;
  className?: string;
  label?: string;
  checked?: boolean;
  value?: boolean;
};

const Switch = ({
  onChange,
  value,
  checked: checkedProp,
  defaultChecked,
  className,
  label,
  ...props
}: SwitchProps) => {
  const [checked, setChecked] = useState(false);

  if (defaultChecked && !checked) {
    setChecked(defaultChecked);
    onChange?.(defaultChecked);
  }

  useEffect(() => {
    if (checkedProp) {
      setChecked(checkedProp);
    }
  }, [checkedProp]);

  useEffect(() => {
    if (value) {
      setChecked(value);
    }
  }, [value]);

  const handleClick = () => {
    onChange?.(!checked);
    setChecked(!checked);
  };

  return (
    <label className='flex gap-2'>
      <button
        type='button'
        onClick={handleClick}
        className={cn(
          'flex h-6 w-11 items-center gap-2 rounded-full transition-all',
          checked ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-800',
          className,
        )}
      >
        <span
          className={cn(
            'relative m-1 h-4 w-4 rounded-full bg-white transition-transform',
            checked && 'translate-x-5',
          )}
        />
        <input
          type='checkbox'
          className='hidden'
          checked={checked}
          readOnly
          {...props}
        />
      </button>
      <span className='cursor-pointer pl-2 text-sm text-gray-700 dark:text-gray-300'>
        {label}
      </span>
    </label>
  );
};

export default Switch;
