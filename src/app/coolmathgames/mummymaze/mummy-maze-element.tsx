'use client';

import { useEffect, useState } from 'react';
import { range } from 'utils/array';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import {
  ALL_DIRECTIONS,
  Direction,
  Enemy,
  Maze,
  Move,
  MummyMaze,
  Point,
} from './mummy-maze';
import MummyMazeRender from './mummy-maze-render';
import useKeyDown from 'hooks/use-key-down';

interface GenerateMummyMazeInput {
  noOfWalls?: number;
  size?: number;
}

const MAX_MAZE_ITERATIONS = 10000;

const rand = (end: number) => Math.floor(Math.random() * end);

const generateSolvableMaze = ({
  noOfWalls = rand(35) + 20,
  size = 8,
}: GenerateMummyMazeInput) => {
  for (let i = 0; i < MAX_MAZE_ITERATIONS; i++) {
    const mummyMaze = generateMummyMaze({ noOfWalls, size });
    if (!mummyMaze.maze.fix()) {
      continue;
    }
    const solution = mummyMaze.solve() ?? [];
    if (solution.length >= size * 2 * 2) {
      console.log(`Found suitable maze after ${i + 1} tries`);
      return mummyMaze;
    }

    if (i % (MAX_MAZE_ITERATIONS / 10) === MAX_MAZE_ITERATIONS / 10 - 1) {
      console.log(
        `${i + 1} iterations done, doing ${
          MAX_MAZE_ITERATIONS - i - 1
        } more...`,
      );
    }
  }
};

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
  const [editDir, setEditDir] = useState<Direction>('up');
  const [showSolution, setShowSolution] = useState(false);
  const [game, setGame] = useState<MummyMaze | undefined>();

  useEffect(() => {
    const mummyMaze = generateSolvableMaze({});
    setGame(mummyMaze);
  }, []);

  const movePlayer = (move: Move) => {
    if (inEditMode) {
      if (move !== 'wait') {
        setEditDir(move);
      }
      return;
    }
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

  useKeyDown('E', () => {
    setInEditMode(!inEditMode);
  });

  useKeyDown('P', () => {
    setShowSolution(!showSolution);
  });

  useKeyDown('R', () => {
    setGame(generateSolvableMaze({}));
  });

  if (!game) {
    return (
      <Loading msg={lang('Laddar Mummy Maze...', 'Loading Mummy Maze...')} />
    );
  }

  const solution = showSolution ? game.solve() : undefined;

  return (
    <div className='flex flex-col gap-4'>
      <MummyMazeRender
        game={game}
        onClick={(x, y) => () => {
          if (inEditMode) {
            const newGame = game.clone();
            newGame.maze.toggleWall(new Point(x, y), editDir);
            setGame(newGame);
            console.log(new Point(x, y));
          }
        }}
      />
      Move: WASD/Arrow keys
      <br />
      Undo: U/Z
      <br />
      New maze: R<br />
      Show solution: P<br />
      Edit mode: E
      {showSolution && (
        <>
          {!solution && <div>No solution found!</div>}
          {solution && (
            <div>
              solution:{' '}
              {game.history.length > 0 && (
                <span className='text-green-600'>
                  {game.history.join(', ') + ', '}
                </span>
              )}
              <span className='text-gray-500'>{solution.join(', ')}</span>
            </div>
          )}
        </>
      )}
      {inEditMode && <div>in edit mode, edit: {editDir}</div>}
    </div>
  );
};

export default MummyMazeElement;
