'use client';

import { useEffect, useState } from 'react';
import { range } from 'utils/array';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import {
  ALL_DIRECTIONS,
  Enemy,
  Maze,
  Move,
  MummyMaze,
  Point,
} from './mummy-maze';
import MummyMazeRender from './mummy-maze-game';
import useKeyDown from 'hooks/use-key-down';

interface GenerateMummyMazeInput {
  noOfWalls?: number;
  size?: number;
}

const rand = (end: number) => Math.floor(Math.random() * end);

const generateMummyMaze = ({
  noOfWalls = rand(30) + 25,
  size = 8,
}: GenerateMummyMazeInput): MummyMaze => {
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
  const goal =
    goalDir === 'up'
      ? new Point(offset, 0)
      : goalDir === 'down'
      ? new Point(offset, size - 1)
      : goalDir === 'left'
      ? new Point(0, offset)
      : new Point(size - 1, offset);

  const priority = rand(3) === 0 ? 'vertical' : 'horizontal';
  const enemies: Enemy[] = range(rand(2) + 1).map((_) => ({
    kind: 'mummy',
    pos: new Point(rand(size), rand(size)),
    priority,
  }));
  if (rand(4) === 0) {
    enemies.push({
      kind: 'scorpion',
      pos: new Point(rand(size), rand(size)),
      priority,
    });
  }

  return new MummyMaze({
    maze: new Maze({
      walls,
      size: new Point(size, size),
    }),
    startPos: new Point(rand(size), rand(size)),
    goal,
    enemies,
  });
};

const MummyMazeElement = () => {
  const [inEditMode, setInEditMode] = useState(false);
  const [game, setGame] = useState<MummyMaze | undefined>();

  useEffect(() => {
    setGame(generateMummyMaze({}));
  }, []);

  const movePlayer = (move: Move) => {
    if (!game) {
      return;
    }
    if (!game.maze.canMove(game.playerPos, move)) {
      return;
    }
    const newGame = game.clone();
    newGame.doMove(move);
    setGame(newGame);
  };

  const undo = () => {
    if (!game) {
      return;
    }
    const newGame = game.clone();
    newGame.undo();
    setGame(newGame);
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
    if (!game) {
      return;
    }
    const solution = game.solve();
    if (solution) {
      console.log(`Solution found: ${solution}`);
    } else {
      console.log('No solution found!');
    }
  });

  useKeyDown('E', () => {
    setInEditMode(!inEditMode);
  });

  if (!game) {
    return (
      <Loading msg={lang('Laddar Mummy Maze...', 'Loading Mummy Maze...')} />
    );
  }

  return <MummyMazeRender game={game} />;
};

export default MummyMazeElement;
