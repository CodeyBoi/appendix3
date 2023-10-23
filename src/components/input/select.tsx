import { SelectHTMLAttributes } from 'react';

export type SelectItem = {
  value: string | number;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
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
  ...props
}: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.currentTarget.value);
  };
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
          'p-2 bg-transparent border rounded shadow-sm cursor-pointer font-display dark:border-neutral-800 dark:text-gray-300' +
          (error ? ' ' + errorStyle : '')
        }
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option
            className='text-black'
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
