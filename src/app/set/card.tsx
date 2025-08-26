import { range } from 'utils/array';
import SetIcon from './icon';
import { Card } from './set';
import { cn } from 'utils/class-names';

export type Shape = 'wave' | 'oval' | 'diamond';
export type Color = 'red' | 'blue' | 'yellow';
export type Fill = 'solid' | 'striped' | 'clear';
export type Amount = 'one' | 'two' | 'three';

const amounts: Record<Amount, number> = {
  one: 1,
  two: 2,
  three: 3,
};

type SetCardProps = Card & { selected?: boolean };

const SetCard = ({
  shape,
  color,
  fill,
  amount,
  selected = false,
}: SetCardProps) => {
  return (
    <div
      className={cn(
        'flex h-48 w-32 select-none flex-col justify-center gap-2 rounded border p-2 text-center shadow-md',
        selected && 'bg-red-600/30',
      )}
    >
      {range(amounts[amount]).map((i) => (
        <SetIcon
          key={JSON.stringify({ shape, color, fill, i })}
          shape={shape}
          color={color}
          fill={fill}
        />
      ))}
    </div>
  );
};

export default SetCard;
