import React from 'react';

const NBR_OF_SAMPLES = 10;
const samples = Array.from({ length: NBR_OF_SAMPLES }, (_, i) =>
  Math.sin((((i + 1) / (NBR_OF_SAMPLES + 1)) * Math.PI) / 2),
);

interface SquircleProps {
  padding?: number;
  n?: number;
  children?: React.ReactNode;
}

type Point = [number, number];

const rotate90Deg = ([x, y]: Point): Point => [y, 1 - x];
const toPath = (points: Point[]) =>
  `M${points.map(([x, y]) => `${x},${y}`).join(' ')}`;

const Squircle = ({ padding = 24, n = 2.6, children }: SquircleProps) => {
  const nFrac = 1 / n;
  // No Math.abs, as x cannot be negative
  const f = (x: number) => (1 - x ** n) ** nFrac;

  const bottomRight: Point[] = [
    [0, 0],
    [0, 1],
    ...samples.map((x): Point => [x, f(x)]),
    [1, 0],
  ];
  const topRight = bottomRight.map(rotate90Deg);
  const topLeft = topRight.map(rotate90Deg);
  const bottomLeft = topLeft.map(rotate90Deg);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <svg viewBox='0 0 1 1' width={padding} height={padding}>
          <path d={toPath(topLeft)} fill='red' />
        </svg>
        <div style={{ flex: 1, backgroundColor: 'red' }} />
        <svg viewBox='0 0 1 1' width={padding} height={padding}>
          <path d={toPath(topRight)} fill='red' />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: `${padding / 1.5}px`, backgroundColor: 'red' }} />
        <div style={{ flex: 1, backgroundColor: 'red' }}>{children}</div>
        <div style={{ width: `${padding / 1.5}px`, backgroundColor: 'red' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <svg viewBox='0 0 1 1' width={padding} height={padding}>
          <path d={toPath(bottomLeft)} fill='red' />
        </svg>
        <div style={{ flex: 1, backgroundColor: 'red' }} />
        <svg viewBox='0 0 1 1' width={padding} height={padding}>
          <path d={toPath(bottomRight)} fill='red' />
        </svg>
      </div>
    </div>
  );
};

export default Squircle;
