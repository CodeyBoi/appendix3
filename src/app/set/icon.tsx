import { Color } from './card';
import { Card } from './set';

const colors: Record<Color, string> = {
  blue: 'text-blue-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
};

export type SetIconProps = Omit<Card, 'amount'>;

const SetIcon = ({ shape, color, fill }: SetIconProps) => {
  return (
    <div className={colors[color]}>
      {fill} {shape}
    </div>
  );
};

export default SetIcon;
