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
      <option value='' disabled={true}>
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
        'flex flex-col' + (disabled ? ' opacity-50 pointer-events-none' : '')
      }
    >
      {label && (
        <label className='flex items-center justify-between'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-red-600'>*</span>}
          </div>
          {error && <span className='text-xs text-red-600'>{error}</span>}
        </label>
      )}
      <select
        className={
          'p-2 bg-transparent border rounded shadow-sm cursor-pointer font-display dark:border-neutral-700 dark:text-gray-300' +
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
