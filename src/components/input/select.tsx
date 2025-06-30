'use client';

import { SelectHTMLAttributes, useState } from 'react';
import { cn } from 'utils/class-names';

export interface SelectItem {
  value: string | number;
  label: string;
}

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange'
> & {
  options: SelectItem[];
  label?: React.ReactNode;
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
  className,
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
      className={cn(
        'relative mt-2 flex flex-col',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {label && (
        <label className='absolute flex -translate-y-2.5 translate-x-2 items-center justify-between bg-white px-1 text-sm text-neutral-500 dark:bg-darkBg'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-base text-red-600'>*</span>}
          </div>
          {error && <span className='text-xs text-red-600'>{error}</span>}
        </label>
      )}
      <select
        className={cn(
          'cursor-pointer rounded border bg-transparent px-2 pb-2 pt-3 font-display shadow-sm dark:border-neutral-800 dark:text-darkText',
          error && errorStyle,
        )}
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
