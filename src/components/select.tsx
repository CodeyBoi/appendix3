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
};

const Select = ({
  options,
  label,
  onChange,
  withAsterisk = false,
  disabled = false,
  ...props
}: SelectProps) => {
  const id = Math.random().toString(36).substring(2);
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
        <label htmlFor={id} className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-red-600'>*</span>}
          </div>
        </label>
      )}
      <select
        className='p-2 border rounded shadow-sm cursor-pointer font-display dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300'
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
