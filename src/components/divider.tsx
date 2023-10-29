import { HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  children?: React.ReactNode;
};

const Divider = ({ ...props }: DividerProps) => {
  return (
    <hr
      {...props}
      className='my-2 flex h-px w-full border-neutral-300 dark:border-neutral-700'
    />
  );
};

export default Divider;
