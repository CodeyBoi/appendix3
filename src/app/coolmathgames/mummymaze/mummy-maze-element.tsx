'use client';

import { useEffect, useMemo, useState } from 'react';
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
import Button from 'components/input/button';

interface GenerateMummyMazeInput {
  noOfWalls?: number;
  size?: number;
  difficulty?: number;
}

const MAX_MAZE_ITERATIONS = 10000;

const rand = (end: number) => Math.floor(Math.random() * end);

const generateSolvableMaze = ({
  size = 8,
  noOfWalls = rand(35) + size * 4,
  difficulty = 3,
}: GenerateMummyMazeInput) => {
  for (let i = 0; i < MAX_MAZE_ITERATIONS; i++) {
    const mummyMaze = generateMummyMaze({ noOfWalls, size });
    if (!mummyMaze.maze.fix()) {
      continue;
    }
    const solution = mummyMaze.solve() ?? [];
    if (solution.length >= size * difficulty) {
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
  const [difficulty, setDifficulty] = useState(3);

  useEffect(() => {
    const mummyMaze = generateSolvableMaze({ difficulty });
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
    setGame(generateSolvableMaze({ difficulty }));
  });

  const solution = useMemo(
    () => (showSolution && game ? game.solve() : undefined),
    [showSolution, game],
  );

  if (!game) {
    return (
      <Loading msg={lang('Laddar Mummy Maze...', 'Loading Mummy Maze...')} />
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <MummyMazeRender
        game={game}
        onClick={(x, y) => () => {
          if (inEditMode) {
            const newGame = game.clone();
            newGame.maze.toggleWall(new Point(x, y), editDir);
            setGame(newGame);
            return;
          }

          const hash = new Point(x, y).hash();
          for (const dir of ALL_DIRECTIONS) {
            if (game.playerPos.add(dir).hash() === hash) {
              movePlayer(dir);
              return;
            }
          }
        }}
      />
      Move: WASD/Arrow keys
      <br />
      Undo: U/Z
      <br />
      New maze: R<br />
      Show solution: P<br />
      Edit mode: E<br />
      <br />
      <span className='italic'>
        Player: Blue
        <br />
        Goal: Green
        <br />
        Mummy: White/Red
        <br />
        Scorpion: Orange
      </span>
      <div className='flex max-w-md flex-col gap-2'>
        <label htmlFor='difficulty'>Difficulty={difficulty}</label>
        <input
          type='range'
          value={difficulty}
          onChange={(e) => {
            const val = parseFloat(e.currentTarget.value);
            if (isNaN(val)) {
              return;
            }
            setDifficulty(val);
          }}
          min={1}
          max={5}
          step={0.1}
        />
      </div>
      <div className='flex max-w-md gap-2'>
        <Button className='max-w-sm md:hidden' onClick={undo}>
          Undo
        </Button>
        <Button
          className='max-w-sm md:hidden'
          onClick={() => {
            setShowSolution(!showSolution);
          }}
        >
          Show solution
        </Button>
        <Button
          className='max-w-sm md:hidden'
          onClick={() => {
            setGame(generateSolvableMaze({ difficulty }));
          }}
        >
          New maze
        </Button>
      </div>
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
