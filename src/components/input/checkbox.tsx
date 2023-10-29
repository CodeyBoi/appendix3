import { InputHTMLAttributes } from 'react';
import { cn } from 'utils/class-names';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
  return (
    <div
      className={cn(
        'flex items-center',
        props.disabled && 'pointer-events-none opacity-50',
      )}
    >
      <label className='flex cursor-pointer items-start gap-2 leading-none'>
        <input
          className={cn(
            'h-4 w-4 cursor-pointer rounded text-white accent-red-600 shadow-sm',
            className,
          )}
          type='checkbox'
          {...props}
        />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
