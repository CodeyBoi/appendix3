import { HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  children?: React.ReactNode;
};

const Divider = ({ ...props }: DividerProps) => {
  return <hr {...props} className='flex w-full h-px my-2 border-opacity-20' />;
};

export default Divider;
