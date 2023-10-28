'use client';

import { SelectHTMLAttributes, useState } from 'react';

export type SelectItem = {
  value: string | number;
  label: string;
};

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange'
> & {
  options: SelectItem[];
  label?: string;
  onChange?: (value: string) => void;
  withAsterisk?: boolean;
  error?: string;
};

const errorStyle =
  'border-red-600 dark:border-red-600 text-red-600 dark:text-red-600';

const Select = ({
  options,
  label,
  onChange,
  withAsterisk = false,
  disabled = false,
  error,
  placeholder,
  ...props
}: SelectProps) => {
  const [selected, setSelected] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.currentTarget.value);
    onChange?.(e.currentTarget.value);
  };

  const optionElements = [];
  if (placeholder) {
    optionElements.push(
      <option value='' disabled={true} key='placeholder'>
        {placeholder}
      </option>,
    );
  }

  optionElements.push(
    options.map((option) => (
      <option className='text-black' key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  );

  return (
    <div
      className={
        'relative flex flex-col pt-2' +
        (disabled ? ' opacity-50 pointer-events-none' : '')
      }
    >
      {label && (
        <label className='absolute flex items-center justify-between px-1 text-sm translate-x-2 -translate-y-2.5 bg-white text-neutral-500 dark:bg-darkBg'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-base text-red-600'>*</span>}
          </div>
          {error && <span className='text-xs text-red-600'>{error}</span>}
        </label>
      )}
      <select
        className={
          'px-2 pt-3 pb-2 bg-transparent border rounded shadow-sm cursor-pointer font-display dark:border-neutral-800 dark:text-darkText' +
          (error ? ' ' + errorStyle : '')
        }
        onChange={handleChange}
        value={selected}
        {...props}
      >
        {optionElements}
      </select>
    </div>
  );
};

export default Select;
