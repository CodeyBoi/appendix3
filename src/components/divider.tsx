import { HTMLAttributes } from 'react';
import { cn } from 'utils/class-names';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  children?: React.ReactNode;
};

const Divider = ({ ...props }: DividerProps) => {
  return (
    <hr
      {...props}
      className={cn(
        'my-2 flex h-px w-full border-neutral-300 dark:border-neutral-700',
        props.className,
      )}
    />
  );
};

export default Divider;
