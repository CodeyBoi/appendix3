import { cn } from 'utils/class-names';

type BurgerVariant = 'normal' | 'burger' | 'pride';

interface BurgerStyle {
  top: (active: boolean) => string;
  middle: (active: boolean) => string;
  bottom: (active: boolean) => string;
}

interface BurgerProps {
  active: boolean;
  onClick?: () => void;
  variant?: BurgerVariant;
}

const styles: Record<BurgerVariant, BurgerStyle> = {
  normal: {
    top: (active) =>
      cn(
        'h-1 w-6 rounded-full border-0 bg-white transition-all',
        active && 'translate-y-1.5 rotate-45',
      ),
    middle: (active) =>
      cn('h-1 w-6 rounded-full bg-white transition-all', active && 'opacity-0'),
    bottom: (active) =>
      cn(
        'h-1 w-6 rounded-full border-0 bg-white transition-all',
        active && '-translate-y-1.5 -rotate-45',
      ),
  },
  burger: {
    top: (active) =>
      cn(
        'h-1 w-6 transition-all',
        active
          ? 'translate-y-1.5 rotate-45 rounded-full border-0 bg-white'
          : 'rounded-t-full bg-amber-300',
      ),
    middle: (active) =>
      cn(
        'ml-0.5 h-1 w-5 rounded-full border-t border-t-yellow-400 bg-orange-950 transition-all',
        active && 'opacity-0',
      ),
    bottom: (active) =>
      cn(
        'h-1 w-6 transition-all',
        active
          ? '-translate-y-1.5 -rotate-45 rounded-full border-0 bg-white'
          : 'rounded-b-sm border-t-2 border-t-green-600 bg-amber-300',
      ),
  },
  pride: {
    top: (active) =>
      cn(
        'h-1 w-6 rounded-full border-y-2 border-b-[#ffa500] border-t-[#ff0000] transition-all',

        active && 'translate-y-1.5 rotate-45 border-white bg-white',
      ),
    middle: (active) =>
      cn(
        'h-1 w-6 rounded-full border-y-2 border-b-[#008000] border-t-[#ffff00] transition-all',
        active && 'opacity-0',
      ),
    bottom: (active) =>
      cn(
        'h-1 w-6 rounded-full border-y-2 border-b-[#800080] border-t-[#0000ff] transition-all',
        active && '-translate-y-1.5 -rotate-45 border-white bg-white',
      ),
  },
};

const Burger = ({ active, onClick, variant = 'normal' }: BurgerProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <button className='flex flex-col gap-0.5' onClick={handleClick}>
      <div className={styles[variant].top(active)} />
      <div className={styles[variant].middle(active)} />
      <div className={styles[variant].bottom(active)} />
    </button>
  );
};

export default Burger;
