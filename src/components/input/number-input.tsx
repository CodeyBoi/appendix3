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
    <div className={cn('relative flex pt-2', className)}>
      {label && (
        <div className='absolute flex -translate-y-2.5 translate-x-2 items-center justify-between bg-white px-1 text-sm text-neutral-500 dark:bg-darkBg'>
          <label className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-base text-red-600'>*</span>}
          </label>
          {error && <span className='text-xs text-red-600'>{error}</span>}
        </div>
      )}
      <input
        type='number'
        className={cn(
          'min-w-0 flex-shrink grow cursor-text rounded border bg-transparent p-2 font-display dark:border-neutral-800 dark:text-gray-300',
          error && errorStyle,
        )}
        onChange={(e) => onChange?.(Number(e.currentTarget.value))}
        {...props}
      />
    </div>
  );
};

export default NumberInput;
