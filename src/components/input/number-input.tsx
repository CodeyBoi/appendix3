import { InputHTMLAttributes } from 'react';
import { cn } from 'utils/class-names';

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
  className,
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
        className={cn(
          'min-w-0 flex-shrink flex-grow cursor-text rounded border bg-transparent p-2 font-display dark:border-neutral-800 dark:text-gray-300',
          error && errorStyle,
          className,
        )}
        onChange={(e) => onChange?.(Number(e.currentTarget.value))}
        {...props}
      />
    </div>
  );
};

export default NumberInput;
