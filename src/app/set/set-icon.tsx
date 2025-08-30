import { cn } from 'utils/class-names';
import { Card, Color, Shape } from './set';

export type SetIconProps = Omit<Card, 'amount'>;

const strokeColors: Record<Color, string> = {
  blue: 'stroke-blue-600',
  red: 'stroke-red-600',
  yellow: 'stroke-yellow-600',
};

const fillColors: Record<Color, string> = {
  blue: 'fill-blue-600',
  red: 'fill-red-600',
  yellow: 'fill-yellow-600',
};

const viewWidth = 100;
const viewHeight = 200;
const strokeWidth = 9;

const getShapePath = (shape: Shape) => {
  switch (shape) {
    case 'oval': {
      const r = viewWidth / 2 - strokeWidth - 3;
      return `M ${-r} ${r + strokeWidth / 2 + 12} a ${r} ${r} 0 1 0 ${
        r * 2
      } 0 l 0 ${-viewHeight / 2 - strokeWidth} a ${r} ${r} 0 1 0 ${-r * 2} 0 z`;
    }

    case 'diamond': {
      const xBoundary = viewWidth / 2 - strokeWidth;
      const yBoundary = viewHeight / 2 - strokeWidth;
      return `M ${xBoundary} 0, 0 ${yBoundary}, ${-xBoundary} 0, 0 ${-yBoundary} z`;
    }

    case 'wave': {
      const path = `M -30 -110 c -28.8 2.65 -36.15 18.7 -19.85 43.25 15.3 22.95 17.5 42.8 7.35 66.05 -5.1 11.75 -9.5 23.75 -9.5 25.9 0 1.2 -0.4 2.65 -0.9 3.15 -1.35 1.45 -3.35 13.85 -3.85 23.75 -1.8 38.65 29.8 66.4 73.25 64.35 15.25 -0.7 25.1 -4.4 32.95 -12.35 8.75 -8.9 9 -19.1 0.8 -31.3 -2.05 -3.05 -4.25 -6.5 -4.9 -7.7 -0.65 -1.25 -1.9 -3.5 -2.7 -5 -9.25 -16.9 -10.45 -32.25 -3.75 -47.25 2.25 -4.95 4.1 -9.3 4.1 -9.65 0 -0.35 0.65 -2 1.4 -3.75 6.7 -15.2 6.7 -49.8 -0.05 -65.65 -5.1 -12.1 -19.35 -30 -23.85 -30 -0.35 0 -2.05 -1.05 -3.8 -2.35 -4 -3 -15.9 -8.65 -18.15 -8.65 -0.95 0 -2.6 -0.5 -3.75 -1.1 -3 -1.6 -16.1 -2.5 -25.8 -5.5 z`;

      const vals = path.split(' ').map((val) => {
        const v = parseInt(val);
        if (isNaN(v)) {
          return val;
        }

        const scale = 100 / 136;
        // const move = isX ? -viewWidth / 2 : -viewHeight /2;

        const newVal = Math.round(v * scale * 100) / 100;

        return newVal.toString();
      });

      return vals.join(' ');
    }
  }
};

const SetIcon = ({ shape, color, fill }: SetIconProps) => {
  return (
    <svg
      className='w-1/3'
      viewBox={`${-viewWidth / 2} ${
        -viewHeight / 2
      } ${viewWidth} ${viewHeight}`}
    >
      <div className='hidden'>
        {shape},{color},{fill}
      </div>
      <path
        className={cn(
          strokeColors[color],
          fill === 'solid' && fillColors[color],
        )}
        strokeWidth={strokeWidth}
        d={getShapePath(shape)}
        fill={fill === 'striped' ? `url(#set-stripes-${color})` : undefined}
        fillOpacity={fill === 'clear' ? 0 : undefined}
      />
    </svg>
  );
};

export default SetIcon;
