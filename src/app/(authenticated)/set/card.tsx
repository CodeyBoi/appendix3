import { range } from 'utils/array';
import SetIcon from './set-icon';
import { Amount, Card } from './set';
import { cn } from 'utils/class-names';

const amounts: Record<Amount, number> = {
  one: 1,
  two: 2,
  three: 3,
};

type SetCardProps = Card & { selected?: boolean; highlighted?: boolean };

const SetCard = ({
  shape,
  color,
  fill,
  amount,
  selected = false,
  highlighted = false,
}: SetCardProps) => {
  return (
    <div
      className={cn(
        'flex aspect-[1.4] w-full justify-center gap-1 rounded border p-2 shadow-md md:p-4',
        highlighted && 'border-yellow-600/40 bg-yellow-600/30',
        selected && 'border-red-600/40 bg-red-600/30',
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
