'use client';

import { range } from 'utils/array';
import MummyMazeTile from './tile';
import React from 'react';
import { cn } from 'utils/class-names';
import { MummyMaze, Point } from './mummy-maze';

const TILE_COLORS = ['#87653c', '#a77f4e'] as const;

interface MummyMazeRenderProps {
  game: MummyMaze;
}

const MummyMazeRender = ({ game }: MummyMazeRenderProps) => {
  if (game.isLost()) {
    console.log('U LOST');
  } else if (game.isWon()) {
    console.log('U WIN');
  }

  return (
    <>
      <div className='relative flex flex-col gap-0 overflow-hidden md:max-w-3xl'>
        <div className='absolute aspect-square w-full'>
          <div
            className='relative z-20 aspect-square rounded-full bg-blue-600 transition-all'
            style={{
              width: `${100 / game.maze.size.x}%`,
              translate: `${game.playerPos.x * 100}% ${
                game.playerPos.y * 100
              }%`,
            }}
          />
        </div>
        {game.enemies.map((enemy, i) => (
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
                width: `${100 / game.maze.size.x}%`,
                translate: `${enemy.pos.x * 100}% ${enemy.pos.y * 100}%`,
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
              width: `${100 / game.maze.size.x}%`,
              translate: `${game.goal.x * 100}% ${game.goal.y * 100}%`,
            }}
          />
        </div>
        {range(game.maze.size.y).map((y) => (
          <div key={`row:${y}`} className='flex gap-0'>
            {range(game.maze.size.x).map((x) => {
              const bgColor =
                (x + y) % 2 === 0 ? TILE_COLORS[0] : TILE_COLORS[1];
              const hash = new Point(x, y).hash();
              return (
                <React.Fragment key={hash}>
                  <MummyMazeTile
                    bgColor={bgColor}
                    size={`${100 / game.maze.size.x}%`}
                    walls={game.maze.walls.get(hash)}
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

export default MummyMazeRender;
