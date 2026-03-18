'use client';

import { range, zip } from 'utils/array';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import CharacterToken from './character-token';
import ReminderToken from './reminder-token';
import React, { useState } from 'react';
import ActionIcon from 'components/input/action-icon';
import { IconArrowsMove } from '@tabler/icons-react';
import { cn } from 'utils/class-names';

interface GrimoireProps {
  players: BotcPlayer[];
  setPlayers: (newPlayers: BotcPlayer[]) => void;
  setCurrentPlayerIndex: (index: number) => void;
}

const getOvalPoints = (n: number) =>
  range(n).map((i) => {
    const t = (2.0 * i * Math.PI) / n - Math.PI / 2.0;
    return { left: 0.5 + 0.4 * Math.cos(t), top: 0.5 + 0.42 * Math.sin(t) };
  });

const toPercent = (v: number) => `${Math.floor(v * 100)}%`;

const Grimoire = ({
  players,
  setPlayers,
  setCurrentPlayerIndex,
}: GrimoireProps) => {
  const [moveMode, setMoveMode] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<
    number | undefined
  >();
  const points = getOvalPoints(players.length);
  return (
    <div className='relative h-[80vh] w-full lg:h-[900px]'>
      <div className='absolute right-2 top-2 flex items-center gap-2'>
        {moveMode && (
          <h6 className='text-neutral-500'>
            Select two tokens to swap positions
          </h6>
        )}
        <ActionIcon
          variant={moveMode ? 'default' : 'subtle'}
          onClick={() => {
            setMoveMode(!moveMode);
            setSelectedTokenIndex(undefined);
          }}
        >
          <IconArrowsMove />
        </ActionIcon>
      </div>
      {zip(players, points).map(([player, point], i) => {
        const key = (player.name ?? '') + player.characterId;
        return (
          <React.Fragment key={key}>
            <div
              className={cn(
                'absolute w-[18%] min-w-[72px] -translate-x-1/2 -translate-y-1/2',
                i === selectedTokenIndex && 'rounded-full shadow-xl',
              )}
              style={{
                left: toPercent(point.left),
                top: toPercent(point.top),
              }}
            >
              <CharacterToken
                playerName={player.name}
                characterId={player.characterId}
                dead={!player.isAlive}
                onClick={() => {
                  if (moveMode) {
                    if (selectedTokenIndex === undefined) {
                      setSelectedTokenIndex(i);
                    } else if (selectedTokenIndex === i) {
                      setSelectedTokenIndex(undefined);
                    } else {
                      const newPlayers = players.slice();
                      const playerA = newPlayers[i];
                      const playerB = newPlayers[selectedTokenIndex];
                      if (!playerA || !playerB)
                        throw new Error(
                          'Error when swapping two token positions',
                        );
                      newPlayers.splice(selectedTokenIndex, 1, playerA);
                      newPlayers.splice(i, 1, playerB);
                      setPlayers(newPlayers);
                      setSelectedTokenIndex(undefined);
                    }
                  } else {
                    setCurrentPlayerIndex(i);
                  }
                }}
              />
            </div>
            {player.reminders
              .concat(player.automaticReminders)
              .map((reminder, i) => (
                <div
                  className='absolute w-[10%] min-w-[52px] -translate-x-1/2 -translate-y-1/2'
                  key={key + reminder.characterId + reminder.message}
                  style={{
                    left: toPercent(
                      (point.left - 0.5) * (1 - (i + 1.6) / 5.5) + 0.5,
                    ),
                    top: toPercent(
                      (point.top - 0.5) * (1 - (i + 1.6) / 5.5) + 0.5,
                    ),
                    zIndex: i + 1,
                  }}
                >
                  <ReminderToken
                    characterId={reminder.characterId}
                    text={reminder.message}
                  />
                </div>
              ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Grimoire;
