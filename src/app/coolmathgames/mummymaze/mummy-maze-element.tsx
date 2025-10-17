'use client';

import { useEffect, useMemo, useState } from 'react';
import { range } from 'utils/array';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import {
  ALL_DIRECTIONS,
  ALL_MOVES,
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
  limit?: number;
}

const rand = (end: number) => Math.floor(Math.random() * end);

const generateSolvableMaze = ({
  size = 8,
  noOfWalls = rand(35) + size * 4,
  difficulty = 3,
  limit = 5000,
}: GenerateMummyMazeInput) => {
  const mummyMaze = generateMummyMaze({ noOfWalls, size });
  for (let i = 0; i < limit; i++) {
    const solution = mummyMaze.solve() ?? [];
    if (solution.length >= size * difficulty) {
      console.log(`Found suitable maze after ${i} toggles`);
      return mummyMaze;
    }
    const wall = mummyMaze.maze.randomWall();
    mummyMaze.maze.toggleWall(wall.point, wall.direction);
  }
};

const generateMummyMaze = ({ size = 8 }: GenerateMummyMazeInput): MummyMaze => {
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
    maze: Maze.generateRandom(new Point(size, size), rand(30) + 25),
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

  const generateNewMaze = () => {
    setGame(generateSolvableMaze({ difficulty }));
  };

  useEffect(() => {
    generateNewMaze();
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
    generateNewMaze();
  });

  const solution = useMemo(
    () => (showSolution && game ? game.solve() : undefined),
    [showSolution, game],
  );

  if (!game) {
    return <Loading msg={lang('Laddar...', 'Loading...')} />;
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

          const clicked = new Point(x, y);
          for (const dir of ALL_MOVES) {
            if (clicked.eq(game.playerPos.add(dir))) {
              movePlayer(dir);
              return;
            }
          }
        }}
      />
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
      <div className='flex max-w-md gap-2 lg:hidden'>
        <Button className='max-w-sm' onClick={undo}>
          Undo
        </Button>
        <Button
          className='max-w-sm'
          onClick={() => {
            setShowSolution(!showSolution);
          }}
        >
          Show solution
        </Button>
        <Button
          className='max-w-sm'
          onClick={() => {
            generateNewMaze();
          }}
        >
          New maze
        </Button>
      </div>
      <span className='italic'>
        Player: Blue
        <br />
        Goal: Green
        <br />
        Mummy: White/Red
        <br />
        Scorpion: Orange
      </span>
      <span className='max-lg:hidden'>
        Move: WASD/Arrow keys
        <br />
        Undo: U/Z
        <br />
        New maze: R<br />
        Show solution: P<br />
        Edit mode: E<br />
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
      {inEditMode && <div>in edit mode, edit: {editDir}</div>}
    </div>
  );
};

export default MummyMazeElement;
