import { cn } from 'utils/class-names';

const Burger = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick?: () => void;
}) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <button className='flex flex-col gap-0.5 p-3' onClick={handleClick}>
      <div
        className={cn(
          'h-1 w-6 transition-all',
          active
            ? 'translate-y-1.5 rotate-45 rounded-full border-0 bg-white'
            : 'rounded-t-full bg-amber-300',
        )}
      />
      <div
        className={cn(
          'ml-0.5 h-1 w-5 rounded-full border-t border-t-yellow-400 bg-orange-950 transition-all',
          active && 'opacity-0',
        )}
      />
      <div
        className={cn(
          'h-1 w-6 transition-all',
          active
            ? '-translate-y-1.5 -rotate-45 rounded-full border-0 bg-white'
            : 'rounded-b-sm border-t-2 border-t-green-600 bg-amber-300',
        )}
      />
    </button>
  );
};

export default Burger;
