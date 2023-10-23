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
      <label className='flex items-end gap-2 leading-none cursor-pointer'>
        <input
          className='w-4 h-4 rounded shadow-sm cursor-pointer accent-red-600'
          type='checkbox'
          {...props}
        />
        {props.label}
      </label>
    </div>
  );
};

export default Checkbox;
