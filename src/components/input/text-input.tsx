import { InputHTMLAttributes } from 'react';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  label?: string;
  withAsterisk?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  description?: string;
  error?: string;
};

const errorStyle =
  'border-red-600 dark:border-red-600 text-red-600 dark:text-red-600';

const TextInput = ({
  label,
  withAsterisk,
  onChange,
  icon,
  description,
  error,
  ...props
}: TextInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.currentTarget.value);
  };

  return (
    <div className='flex flex-col flex-shrink min-w-0'>
      {label && (
        <div className='flex items-center justify-between'>
          <label className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-red-600'>*</span>}
          </label>
          {error && <span className='text-xs text-red-600'>{error}</span>}
        </div>
      )}
      {description && (
        <span className='-mt-1 text-xs leading-6 tracking-tight text-gray-400'>
          {description}
        </span>
      )}
      <div
        className={
          'relative flex items-center bg-transparent border rounded shadow-sm h-9 dark:border-neutral-800' +
          (error ? ' ' + errorStyle : '')
        }
      >
        {icon && <div className='absolute px-2'>{icon}</div>}
        <input
          className={
            'flex-grow flex-shrink min-w-0 bg-transparent cursor-text font-display dark:text-gray-300' +
            (icon ? ' py-2 pr-2 pl-9' : ' p-2')
          }
          type='text'
          onChange={handleChange}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextInput;
