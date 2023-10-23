import { InputHTMLAttributes } from 'react';

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label?: string;
  onChange?: (n: number) => void;
  withAsterisk?: boolean;
};

const NumberInput = ({
  label,
  onChange,
  withAsterisk = false,
  ...props
}: NumberInputProps) => {
  return (
    <div className='flex flex-col flex-shrink min-w-0'>
      {label && (
        <label className='flex gap-1'>
          {label}
          {withAsterisk && <span className='text-red-600'>*</span>}
        </label>
      )}
      <input
        type='number'
        className='flex-grow flex-shrink min-w-0 p-2 bg-transparent border rounded dark:border-neutral-800 cursor-text font-display dark:text-gray-300'
        onChange={(e) => onChange?.(Number(e.currentTarget.value))}
        {...props}
      />
    </div>
  );
};

export default NumberInput;
