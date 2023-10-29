import { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = (props: CheckboxProps) => {
  return (
    <div
      className={
        'flex items-center' +
        (props.disabled ? ' pointer-events-none opacity-50' : '')
      }
    >
      <label className='flex cursor-pointer items-start gap-2 leading-none'>
        <input
          className='h-4 w-4 cursor-pointer rounded text-white accent-red-600 shadow-sm'
          type='checkbox'
          {...props}
        />
        {props.label}
      </label>
    </div>
  );
};

export default Checkbox;
