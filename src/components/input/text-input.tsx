import { InputHTMLAttributes } from 'react';

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label?: string;
  withAsterisk?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  description?: string;
};

const TextInput = ({
  label,
  withAsterisk,
  onChange,
  icon,
  description,
  ...props
}: TextInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.currentTarget.value);
  };

  return (
    <div className='flex flex-col'>
      {label && (
        <label className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-red-600'>*</span>}
          </div>
        </label>
      )}
      {description && (
        <span className='-mt-1 text-xs leading-6 tracking-tight text-gray-400'>
          {description}
        </span>
      )}
      <div className='flex items-center gap-2 p-2 bg-transparent border rounded shadow-sm dark:border-neutral-800'>
        {icon}
        <input
          className='flex-grow flex-shrink min-w-0 bg-transparent outline-none cursor-text font-display dark:text-gray-300'
          onChange={handleChange}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextInput;
