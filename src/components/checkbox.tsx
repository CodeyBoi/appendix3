import { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Checkbox = (props: CheckboxProps) => {
  const id = Math.random().toString(36).substring(2);
  return (
    <div
      className={
        'flex items-center' +
        (props.disabled ? ' pointer-events-none opacity-50' : '')
      }
    >
      <input
        className='w-4 h-4 rounded cursor-pointer accent-red-600'
        type='checkbox'
        id={id}
        {...props}
      />
      <label className='pl-2 leading-none cursor-pointer ' htmlFor={id}>
        {props.label}
      </label>
    </div>
  );
};

export default Checkbox;
