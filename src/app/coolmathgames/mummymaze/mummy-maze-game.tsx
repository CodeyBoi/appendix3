'use client';

import useKeyDown from 'hooks/use-key-down';
import { useState } from 'react';
import { range } from 'utils/array';
import MummyMazeTile from './tile';
import React from 'react';
import { cn } from 'utils/class-names';

export type Point = [number, number];

export const ALL_DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof ALL_DIRECTIONS)[number];
const ALL_MOVES = ['up', 'down', 'left', 'right', 'wait'] as const;
type Move = (typeof ALL_MOVES)[number];

type Axis = 'horizontal' | 'vertical';
type EnemyType = 'mummy' | 'scorpion';

const TILE_COLORS = ['#87653c', '#a77f4e'] as const;

export interface Enemy {
  kind: EnemyType;
  pos: Point;
  priority: Axis;
}

export interface Maze {
  walls: Map<string, Set<'up' | 'left'>>;
  size: Point;
}

export interface MummyMazeProps {
  enemies: Enemy[];
  gate?: [Point, 'up' | 'left'];
  startPos: Point;
  goal: Point;
  maze: Maze;
}

const dirToPoint: Record<Direction, Point> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export const hashPoint = (point: Point) => `${point[0]}:${point[1]}`;

const hashState = (state: MummyMazeProps & { playerPos: Point }) =>
  `${hashPoint(state.playerPos)}/${state.enemies
    .map((e) => hashPoint(e.pos))
    .join(',')}`;

export const addDirection = ([x, y]: Point, direction: Direction) => {
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

const isLoss = (state: MummyMazeProps & { playerPos: Point }) =>
  state.enemies.some((e) => hashPoint(e.pos) === hashPoint(state.playerPos));

const isWin = (state: MummyMazeProps & { playerPos: Point }) =>
  !isLoss(state) && hashPoint(state.playerPos) === hashPoint(state.goal);

const wallsAt = (maze: Maze, [x, y]: Point) => {
  // Copy set, otherwise we could accidentally modify the wall set
  const out: Set<Direction> = new Set(
    maze.walls.get(hashPoint([x, y])) ?? new Set(),
  );
  if (y <= 0) {
    out.add('up');
  }
  if (x <= 0) {
    out.add('left');
  }
  if (
    y + 1 >= maze.size[1] ||
    (maze.walls.get(hashPoint([x, y + 1])) ?? new Set()).has('up')
  ) {
    out.add('down');
  }
  if (
    x + 1 >= maze.size[0] ||
    (maze.walls.get(hashPoint([x + 1, y])) ?? new Set()).has('left')
  ) {
    out.add('right');
  }
  return out;
};

const canMove = (maze: Maze, from: Point, move: Move) =>
  move === 'wait' || !wallsAt(maze, from).has(move);

const MummyMazeGame = ({
  maze,
  enemies = [],
  gate,
  startPos,
  goal,
}: MummyMazeProps) => {
  const [history, setHistory] = useState<Move[]>([]);
  const [width, height] = maze.size;

  const solveMaze = (game: MummyMazeProps): Move[] | undefined => {
    const seenStates = new Set();
    const queue: Move[][] = [[]];

    while (queue.length > 0) {
      const moves = queue.shift();
      if (!moves) {
        return;
      }
      const gameState = processMoves(game, moves);
      const hash = hashState(gameState);
      if (seenStates.has(hash) || isLoss(gameState)) {
        continue;
      } else if (isWin(gameState)) {
        return moves;
      }

      seenStates.add(hash);

      for (const move of ALL_MOVES.filter((m) =>
        canMove(maze, gameState.playerPos, m),
      )) {
        moves.push(move);
        queue.push(moves.slice());
        moves.pop();
      }
    }
  };

  const calcEnemyMove = (enemy: Enemy, playerPos: Point): Move =>
    getDirections(enemy.pos, playerPos, enemy.priority).find((dir) =>
      canMove(maze, enemy.pos, dir),
    ) ?? 'wait';

  const processMoves = (
    game: MummyMazeProps & { playerPos?: Point },
    moves: Move[],
  ) => {
    let playerPos: Point = game.playerPos
      ? [game.playerPos[0], game.playerPos[1]]
      : [game.startPos[0], game.startPos[1]];
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

  const currentGameState = processMoves(
    {
      maze,
      enemies,
      gate,
      startPos,
      goal,
    },
    history,
  );

  const movePlayer = (move: Move) => {
    if (move !== 'wait' && !canMove(maze, currentGameState.playerPos, move)) {
      return;
    }
    setHistory((old) => [...old, move]);
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

  useKeyDown(' ', () => {
    movePlayer('wait');
  });

  useKeyDown(['U', 'Z'], () => {
    undo();
  });

  useKeyDown('N', () => {
    const solution = solveMaze(currentGameState);
    if (solution) {
      console.log(`Solution found: ${solution}`);
    } else {
      console.log('No solution found!');
    }
  });

  if (isLoss(currentGameState)) {
    console.log('U LOST');
  } else if (isWin(currentGameState)) {
    console.log('U WIN');
  }

  return (
    <>
      <div className='relative flex flex-col gap-0 overflow-hidden md:max-w-3xl'>
        <div className='absolute aspect-square w-full'>
          <div
            className='relative z-20 aspect-square rounded-full bg-blue-600 transition-all'
            style={{
              width: `${100 / width}%`,
              translate: `${currentGameState.playerPos[0] * 100}% ${
                currentGameState.playerPos[1] * 100
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
        <div className='absolute aspect-square w-full'>
          <div
            className='relative z-20 aspect-square rounded-full bg-green-600 transition-all'
            style={{
              width: `${100 / width}%`,
              translate: `${currentGameState.goal[0] * 100}% ${
                currentGameState.goal[1] * 100
              }%`,
            }}
          />
        </div>
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
                    walls={maze.walls.get(hashPoint([x, y]))}
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

export default MummyMazeGame;
