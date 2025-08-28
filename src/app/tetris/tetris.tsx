'use client';

// Styling and gameplay guidelines according to https://tetris.wiki/Tetris_Guideline

import { range, toShuffled } from 'utils/array';
import Board from './board';
import { useEffect, useState } from 'react';
import Piece, { ROTATIONS, Shape, SHAPES } from './piece';
import useKeyDown from 'hooks/use-key-down';

// Describes a point as [rowOffset, colOffset] from the top left cell as [0, 0] and the bottom right as [HEIGHT - 1, WIDTH - 1]
export type Point = [number, number];

const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];

const modAdd = (a: number, b: number, mod: number) => {
  const aAbs = a >= 0 ? a : mod + a;
  const bAbs = b >= 0 ? b : mod + b;
  return (aAbs + bAbs) % mod;
};

const getNewShapePool = () => toShuffled(SHAPES);

const Tetris = () => {
  const [rotationIdx, setRotationIdx] = useState(0);
  const [shape, setShape] = useState<Shape>('I');
  const [position, setPosition] = useState<Point>([0, 4]);
  const [shapePool, setShapePool] = useState<Shape[]>([]);

  // Initialize game values
  useEffect(() => {
    const initShapePool = getNewShapePool();
    const initShape = initShapePool.pop();
    if (!initShape) {
      throw new Error('Failed initializing shape pool');
    }
    setShape(initShape);
    setShapePool(initShapePool);
  }, []);

  // Refresh shape pool if its ever empty
  useEffect(() => {
    if (shapePool.length === 0) {
      setShapePool(toShuffled(SHAPES));
    }
  }, [shapePool]);

  const move = (p: Point) =>
    { setPosition([position[0] + p[0], position[1] + p[1]]); };

  const rotate = (diff: number) => {
    setRotationIdx(modAdd(rotationIdx, diff, ROTATIONS.length));
  };

  const popShapePool = () => {
    const shape = shapePool[-1];
    setShapePool(shapePool.slice(0, -1));
    return shape as Shape;
  };

  useKeyDown('ArrowLeft', () => {
    move([0, -1]);
  });
  useKeyDown('ArrowRight', () => {
    move([0, 1]);
  });
  useKeyDown('ArrowDown', () => {
    move([1, 0]);
  });
  useKeyDown(['ArrowUp', 'X'], () => {
    rotate(1);
  });
  useKeyDown('Z', () => {
    rotate(-1);
  });

  const updateGameState = () => {};

  const rotation = ROTATIONS[rotationIdx] ?? 'up';

  const board = range(22).map((_) => range(10).map((_) => true));
  return (
    <div className='m-12'>
      <Piece shape={shape} rotation={rotation} position={position} />

      <Board board={board} />
    </div>
  );
};

export default Tetris;
