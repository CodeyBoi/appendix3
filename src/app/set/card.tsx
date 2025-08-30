import { range } from 'utils/array';
import SetIcon from './set-icon';
import { Amount, Card } from './set';
import { cn } from 'utils/class-names';

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
        'flex h-28 w-40 justify-center gap-2 rounded border p-2 shadow-md',
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
