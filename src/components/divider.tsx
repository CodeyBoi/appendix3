import { HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  children?: React.ReactNode;
};

const Divider = ({ ...props }: DividerProps) => {
  return (
    <hr
      {...props}
      className='flex w-full h-px my-2 border-neutral-300 dark:border-neutral-700'
    />
  );
};

export default Divider;
