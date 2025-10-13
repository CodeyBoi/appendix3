'use client';

import useKeyDown from 'hooks/use-key-down';
import { useEffect, useState } from 'react';
import { range } from 'utils/array';
import MummyMazeTile from './tile';
import React from 'react';
import { cn } from 'utils/class-names';

type Point = [number, number];

const ALL_DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof ALL_DIRECTIONS)[number];
type Move = Direction | 'wait';

type Axis = 'horizontal' | 'vertical';
type EnemyType = 'mummy' | 'scorpion';

const TILE_COLORS = ['#87653c', '#a77f4e'] as const;

interface Enemy {
  kind: EnemyType;
  pos: Point;
  priority: Axis;
}

interface MummyMazeProps {
  walls: Map<string, Set<'up' | 'left'>>;
  enemies: Enemy[];
  size?: [number, number];
  gate?: [Point, 'up' | 'left'];
  startPos: Point;
}

const dirToPoint: Record<Direction, Point> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const hashPoint = (point: Point) => `${point[0]}:${point[1]}`;

const addDirection = ([x, y]: Point, direction: Direction) => {
  const [dx, dy] = dirToPoint[direction];
  return [x + dx, y + dy] as Point;
};

const applyMove = (p: Point, move: Move) =>
  move === 'wait' ? p : addDirection(p, move);

const getDirections = (
  [x1, y1]: Point,
  [x2, y2]: Point,
  prio: Axis = 'horizontal',
) => {
  const prios: Record<Direction, number> =
    prio === 'horizontal'
      ? {
          left: 1,
          right: 1,
          up: 2,
          down: 2,
        }
      : {
          up: 1,
          down: 1,
          left: 2,
          right: 2,
        };
  const [dx, dy] = [x2 - x1, y2 - y1];
  const out: Direction[] = [];
  if (dy != 0) {
    out.push(dy > 0 ? 'down' : 'up');
  }

  if (dx != 0) {
    out.push(dx > 0 ? 'right' : 'left');
  }
  return out.sort((a, b) => prios[a] - prios[b]);
};

const MummyMaze = ({
  walls,
  size: [width, height] = [8, 8],
  enemies = [],
  gate,
  startPos,
}: MummyMazeProps) => {
  const [history, setHistory] = useState<Move[]>([]);
  const [isActionable, setIsActionable] = useState(true);

  const currentPlayerPos = history.reduce(
    (acc, move) => applyMove(acc, move),
    startPos,
  );

  const wallsAt = ([x, y]: Point) => {
    // Copy set, otherwise we could accidentally modify the wall set
    const out: Set<Direction> = new Set(
      walls.get(hashPoint([x, y])) ?? new Set(),
    );
    if (y <= 0) {
      out.add('up');
    }
    if (x <= 0) {
      out.add('left');
    }
    if (
      y + 1 >= height ||
      (walls.get(hashPoint([x, y + 1])) ?? new Set()).has('up')
    ) {
      out.add('down');
    }
    if (
      x + 1 >= width ||
      (walls.get(hashPoint([x + 1, y])) ?? new Set()).has('left')
    ) {
      out.add('right');
    }
    return out;
  };

  const canMove = (from: Point, direction: Direction) =>
    !wallsAt(from).has(direction);

  const calcEnemyMove = (enemy: Enemy, playerPos: Point): Move =>
    getDirections(enemy.pos, playerPos, enemy.priority).find((dir) =>
      canMove(enemy.pos, dir),
    ) ?? 'wait';

  const processMoves = (game: MummyMazeProps, moves: Move[]) => {
    let playerPos = game.startPos;
    let enemies = game.enemies.slice();
    for (const move of moves) {
      playerPos = applyMove(playerPos, move);
      enemies = enemies.map((enemy) =>
        range(enemy.kind === 'scorpion' ? 1 : 2).reduce(
          (acc, _) => ({
            ...acc,
            pos: applyMove(acc.pos, calcEnemyMove(acc, playerPos)),
          }),
          enemy,
        ),
      );
    }
    return {
      ...game,
      enemies,
      playerPos,
    };
  };

  useEffect(() => {}, [history]);

  const currentGameState = processMoves(
    {
      walls,
      size: [width, height],
      enemies,
      gate,
      startPos,
    },
    history,
  );

  const movePlayer = (move: Move) => {
    if (move !== 'wait' && !canMove(currentPlayerPos, move)) {
      return;
    }
    setHistory((old) => [...old, move]);
    setIsActionable(false);
  };

  const undo = () => {
    const newHistory = history.slice();
    newHistory.pop();
    setHistory(newHistory);
  };

  useKeyDown(['W', 'ArrowUp'], () => {
    movePlayer('up');
  });

  useKeyDown(['S', 'ArrowDown'], () => {
    movePlayer('down');
  });

  useKeyDown(['A', 'ArrowLeft'], () => {
    movePlayer('left');
  });

  useKeyDown(['D', 'ArrowRight'], () => {
    movePlayer('right');
  });

  useKeyDown('Space', () => {
    movePlayer('wait');
  });

  useKeyDown(['U', 'Z'], () => {
    undo();
  });

  return (
    <>
      <div className='relative flex flex-col gap-0 overflow-hidden md:max-w-2xl'>
        <div className='absolute aspect-square w-full'>
          <div
            className='relative z-20 aspect-square rounded-full bg-blue-600 transition-all'
            style={{
              width: `${100 / width}%`,
              translate: `${currentPlayerPos[0] * 100}% ${
                currentPlayerPos[1] * 100
              }%`,
            }}
          />
        </div>
        {currentGameState.enemies.map((enemy, i) => (
          <div key={i} className='absolute aspect-square w-full'>
            <div
              className={cn(
                'relative z-20 aspect-square rounded-full text-center text-black transition-all',
                enemy.kind === 'scorpion'
                  ? 'bg-orange-600'
                  : enemy.priority === 'horizontal'
                  ? 'bg-white'
                  : 'bg-red-600',
              )}
              style={{
                width: `${100 / width}%`,
                translate: `${enemy.pos[0] * 100}% ${enemy.pos[1] * 100}%`,
              }}
            >
              <br />
              {enemy.kind}
            </div>
          </div>
        ))}
        {range(height).map((y) => (
          <div key={`row:${y}`} className='flex gap-0'>
            {range(width).map((x) => {
              const bgColor =
                (x + y) % 2 === 0 ? TILE_COLORS[0] : TILE_COLORS[1];
              return (
                <React.Fragment key={hashPoint([x, y])}>
                  <MummyMazeTile
                    bgColor={bgColor}
                    size={`${100 / width}%`}
                    walls={walls.get(hashPoint([x, y]))}
                  />
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default MummyMaze;
