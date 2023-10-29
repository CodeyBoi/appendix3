import { InputHTMLAttributes } from 'react';

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label?: string;
  onChange?: (n: number) => void;
  withAsterisk?: boolean;
  error?: string;
};

const errorStyle =
  'border-red-600 dark:border-red-600 text-red-600 dark:text-red-600';

const NumberInput = ({
  label,
  onChange,
  withAsterisk = false,
  error,
  ...props
}: NumberInputProps) => {
  return (
    <div className='flex min-w-0 shrink flex-col'>
      {label && (
        <div className='flex items-center justify-between'>
          <label className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-red-600'>*</span>}
          </label>
          {error && <span className='text-xs text-red-600'>{error}</span>}
        </div>
      )}
      <input
        type='number'
        className={
          'flex-grow flex-shrink min-w-0 p-2 bg-transparent border rounded dark:border-neutral-800 cursor-text font-display dark:text-gray-300' +
          (error ? ' ' + errorStyle : '')
        }
        onChange={(e) => onChange?.(Number(e.currentTarget.value))}
        {...props}
      />
    </div>
  );
};

export default NumberInput;
