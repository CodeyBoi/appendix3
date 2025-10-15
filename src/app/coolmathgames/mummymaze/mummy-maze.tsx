'use client';

import { useEffect, useState } from 'react';
import MummyMazeGame, {
  addDirection,
  ALL_DIRECTIONS,
  Enemy,
  hashPoint,
  Maze,
  MummyMazeProps,
  Point,
} from './mummy-maze-game';
import { range } from 'utils/array';
import Loading from 'components/loading';
import { lang } from 'utils/language';

interface GenerateMummyMazeInput {
  noOfWalls?: number;
  size?: number;
}

const rand = (end: number) => Math.floor(Math.random() * end);

const findUnreachable = ({ walls, size }: Maze) => {
  const [width, height] = size;
  const visited = new Set();
  const queue: Point[] = [[0, 0]];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }
    visited.add(hashPoint(current));

    for (const direction of ALL_DIRECTIONS) {
      const next = addDirection(current, direction);
      if (visited.has(hashPoint(next))) {
        continue;
      }
      queue.push(addDirection(current, direction));
    }
  }
  return range(height).flatMap((y) => range(width).map((x) => [x, y] as Point)).filter((p) => !visited.has(hashPoint(p)));
};

const fixMaze = ({ walls, size }: Maze) => {
  for (;;) {
    const unreachables = findUnreachable({ walls, size });

    if (unreachables.length === 0) {
      break;
    }
    
    for (const tile of unreachables) {
    }
  }
};

const generateMummyMaze = ({
  noOfWalls = rand(30) + 25,
  size = 8,
}: GenerateMummyMazeInput): MummyMazeProps => {
  const walls = range(noOfWalls).reduce((acc, _) => {
    const [x, y] = [rand(size), rand(size)];
    if (x === 0 && y === 0) {
      return acc;
    }
    const hash = `${x}:${y}`;
    const direction =
      x === 0 ? 'up' : y === 0 ? 'left' : Math.random() > 0.5 ? 'up' : 'left';
    acc.set(hash, (acc.get(hash) ?? new Set()).add(direction));
    return acc;
  }, new Map<string, Set<'up' | 'left'>>());

  const goalDir = ALL_DIRECTIONS[rand(ALL_DIRECTIONS.length)];
  const offset = rand(size);
  const goal: Point =
    goalDir === 'up'
      ? [offset, 0]
      : goalDir === 'down'
      ? [offset, size - 1]
      : goalDir === 'left'
      ? [0, offset]
      : [size - 1, offset];

  const priority = rand(3) === 0 ? 'vertical' : 'horizontal';
  const enemies: Enemy[] = range(rand(2) + 1).map((_) => ({
    kind: 'mummy',
    pos: [rand(size), rand(size)],
    priority,
  }));
  if (rand(4) === 0) {
    enemies.push({ kind: 'scorpion', pos: [rand(size), rand(size)], priority });
  }

  return {
    maze: {
      walls,
      size: [size, size],
    },
    startPos: [rand(size), rand(size)],
    goal,
    enemies,
  };
};

const MummyMaze = () => {
  const [inEditMode, setInEditMode] = useState(false);
  const [game, setGame] = useState<MummyMazeProps | undefined>();

  useEffect(() => {
    setGame(generateMummyMaze({}));
  }, []);

  if (!game) {
    return (
      <Loading msg={lang('Laddar Mummy Maze...', 'Loading Mummy Maze...')} />
    );
  }

  return <MummyMazeGame {...game} />;
};

export default MummyMaze;
