'use client';

import { InputHTMLAttributes, useEffect, useState } from 'react';

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'checked' | 'defaultChecked' | 'value'
> & {
  onChange?: (value?: boolean) => void;
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
        className={`flex items-center h-6 gap-2 rounded-full w-11 transition-all ${
          checked ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-800'
        } ${className}`}
      >
        <span
          className={`relative w-4 h-4 m-1 rounded-full transition-transform bg-white transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
        <input
          type='checkbox'
          className='hidden'
          checked={checked}
          onChange={() => {}}
          {...props}
        />
      </button>
      <span className='pl-2 text-sm text-gray-700 cursor-pointer dark:text-gray-300'>
        {label}
      </span>
    </label>
  );
};

export default Switch;
