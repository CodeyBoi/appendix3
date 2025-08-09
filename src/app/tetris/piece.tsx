import { cn } from 'utils/class-names';
import { Point } from './tetris';

export interface PieceProps {
  shape: Shape;
  position: Point;
  rotation?: Rotation;
}

type ShapeTileOffsets = [Point, Point, Point];

export const SHAPES = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'] as const;
export type Shape = (typeof SHAPES)[number];

export const ROTATIONS = ['up', 'right', 'down', 'left'] as const;
export type Rotation = (typeof ROTATIONS)[number];

// Defines a shape with a rotation of `top` with center at `position` by defining one tile at offset [0, 0] with three additional offsets to define the rest of the tiles. Shapes `I` and `O` have their center at [0.5, 0.5] and must be handled separately.
const tileOffsets: Record<Shape, ShapeTileOffsets> = {
  I: [
    [0, -1],
    [0, 1],
    [0, 2],
  ],
  J: [
    [-1, -1],
    [0, -1],
    [0, 1],
  ],
  L: [
    [-1, 1],
    [0, 1],
    [0, -1],
  ],
  O: [
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  S: [
    [0, -1],
    [-1, 0],
    [-1, 1],
  ],
  Z: [
    [0, 1],
    [-1, 0],
    [-1, -1],
  ],
  T: [
    [0, -1],
    [-1, 0],
    [0, 1],
  ],
};

const translationsI: Record<Rotation, Point> = {
  up: [0, 0],
  right: [0, 1],
  down: [1, 1],
  left: [1, 0],
};

const colors: Record<Shape, string> = {
  I: 'bg-cyan-300',
  J: 'bg-blue-800',
  L: 'bg-orange-500',
  O: 'bg-yellow-400',
  S: 'bg-lime-400',
  Z: 'bg-red-600',
  T: 'bg-purple-500',
};

const rotationFuncs: Record<Rotation, (p: Point) => Point> = {
  up: (p) => p,
  right: ([row, col]) => [col, -row],
  down: ([row, col]) => [-row, -col],
  left: ([row, col]) => [-col, row],
};

const _getTileOffsets = (shape: Shape, rotation: Rotation) => {
  const offsets = tileOffsets[shape].concat([[0, 0]]);

  // Rotation has no effect on shape `O`
  if (shape === 'O') {
    return offsets;
  }

  const rotationFunc = rotationFuncs[rotation];
  const rotated = offsets.map(rotationFunc);

  // If shape is `I`, apply translation to account for the center being at [0.5, 0.5]
  if (shape === 'I') {
    const [dRow, dCol] = translationsI[rotation];
    return rotated.map(([row, col]) => [row + dRow, col + dCol] as Point);
  }

  return rotated;
};

export const getPieceOffsets = (piece: PieceProps) =>
  _getTileOffsets(piece.shape, piece.rotation ?? 'up').map(([row, col]) => [
    row + piece.position[0],
    col + piece.position[1],
  ]);

const Piece = ({ shape, rotation = 'up', position }: PieceProps) => {
  const offsets = _getTileOffsets(shape, rotation);
  return (
    <div className='relative'>
      {offsets.map(([row, col]) => (
        <div
          className={cn('absolute h-8 w-8 border border-white', colors[shape])}
          style={{
            marginTop: `${(position[0] + row) * 32}px`,
            marginLeft: `${(position[1] + col) * 32}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Piece;
