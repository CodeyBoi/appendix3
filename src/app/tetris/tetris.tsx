'use client';

// Styling and gameplay guidelines according to https://tetris.wiki/Tetris_Guideline

import { range } from 'utils/array';
import Board from './board';
import { useState } from 'react';
import { ROTATIONS, SHAPES } from './piece';
import useKeyDown from 'hooks/use-key-down';

// Describes a point as [rowOffset, colOffset] from the top left cell as [0, 0] and the bottom right as [HEIGHT - 1, WIDTH - 1]
export type Point = [number, number];

const addMod = (a: number, b: number, mod: number) => {
  const aAbs = a >= 0 ? a : mod + a;
  const bAbs = b >= 0 ? b : mod + b;
  return (aAbs + bAbs) % mod;
};

const Tetris = () => {
  const [rotationIdx, setRotationIdx] = useState(0);
  const [shapeIdx, setShapeIdx] = useState(0);

  const rotate = (diff: number) => {
    setRotationIdx(addMod(rotationIdx, diff, ROTATIONS.length));
  };

  const swapShape = (diff: number) => {
    setShapeIdx(addMod(shapeIdx, diff, SHAPES.length));
  };

  useKeyDown('ArrowUp', () => {
    swapShape(1);
  });
  useKeyDown('ArrowDown', () => {
    swapShape(-1);
  });
  useKeyDown('ArrowLeft', () => {
    rotate(-1);
  });
  useKeyDown('ArrowRight', () => {
    rotate(1);
  });

  const rotation = ROTATIONS[rotationIdx] ?? 'up';
  const shape = SHAPES[shapeIdx] ?? 'I';

  const board = range(22).map((_) => range(10).map((_) => false));
  return (
    <div className='m-12'>
      <Board
        board={board}
        piece={{
          shape,
          position: [0, 0],
          rotation,
        }}
      />{' '}
    </div>
  );
};

export default Tetris;
