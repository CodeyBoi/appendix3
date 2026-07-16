'use client';

import { range, zip } from 'utils/array';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import CharacterToken from './character-token';
import ReminderToken from './reminder-token';
import React, { useState } from 'react';
import ActionIcon from 'components/input/action-icon';
import { IconArrowsMove, IconCirclePlus2 } from '@tabler/icons-react';
import Modal from 'components/modal';
import CharacterTokenSelector from './character-token-selector';
import { CharacterId } from './characters';

interface GrimoireProps {
  players: BotcPlayer[];
  setPlayers: (newPlayers: BotcPlayer[]) => void;
  setCurrentPlayerIndex: (index: number) => void;
  scriptCharacters: CharacterId[];
}

const getOvalPoints = (n: number) =>
  range(n).map((i) => {
    const t = (2.0 * i * Math.PI) / n - Math.PI * (1.5 - 1 / n);
    return { left: 0.5 + 0.4 * Math.cos(t), top: 0.5 + 0.42 * Math.sin(t) };
  });
const toPercent = (v: number) => `${Math.floor(v * 100)}%`;

const Grimoire = ({
  players,
  setPlayers,
  setCurrentPlayerIndex,
  scriptCharacters,
}: GrimoireProps) => {
  const [moveMode, setMoveMode] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<
    number | undefined
  >();
  const [draggedReminder, setDraggedReminder] = useState<
    { playerIndex: number; reminderIndex: number } | undefined
  >();
  const [addCharacterModalOpen, setAddCharacterModalOpen] = useState(false);
  const points = getOvalPoints(players.length);
  return (
    <>
      <Modal
        title='Add character token'
        withCloseButton
        open={addCharacterModalOpen}
        onFocus={() => {
          setAddCharacterModalOpen(true);
        }}
        onBlur={() => {
          setAddCharacterModalOpen(false);
        }}
      >
        <CharacterTokenSelector
          characters={players.map((p) => p.characterId)}
          allCharacters={scriptCharacters}
          onChange={(characterId) => {
            const newPlayers = players.slice();
            // Get the first unique player id
            const idSet = new Set(newPlayers.map((p) => p.id));
            const id =
              range(0, newPlayers.length).find((id) => !idSet.has(id)) ??
              newPlayers.length;
            newPlayers.push(new BotcPlayer({ characterId, id }));
            setPlayers(newPlayers);
            setAddCharacterModalOpen(false);
          }}
          defaultShowAll
        />
      </Modal>
      <div className='relative h-[65vh] w-full lg:h-[900px]'>
        <div className='absolute right-2 top-2 flex items-center gap-2'>
          {moveMode && (
            <h6 className='text-neutral-500'>
              Select two tokens to swap positions
            </h6>
          )}
          <ActionIcon
            variant='subtle'
            onClick={() => {
              setAddCharacterModalOpen(true);
            }}
          >
            <IconCirclePlus2 />
          </ActionIcon>
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
        {zip(players, points).map(([player, point], playerIndex) => {
          const key = `${player.characterId}-${player.id}`;
          return (
            <React.Fragment key={key}>
              <div
                className='absolute w-[18%] min-w-[72px] -translate-x-1/2 -translate-y-1/2'
                style={{
                  left: toPercent(point.left),
                  top: toPercent(point.top),
                }}
                onDragEnter={() => {
                  if (!draggedReminder) {
                    return;
                  }
                  const srcPlayer = players[draggedReminder.playerIndex];
                  if (!srcPlayer) {
                    return;
                  }
                  const reminders = srcPlayer.reminders.splice(
                    draggedReminder.reminderIndex,
                    1,
                  );
                  for (const reminder of reminders) {
                    player.reminders.push(reminder);
                  }
                  setDraggedReminder({
                    playerIndex,
                    reminderIndex: player.reminders.length - 1,
                  });
                }}
              >
                <CharacterToken
                  playerName={player.name}
                  characterId={player.characterId}
                  dead={!player.isAlive}
                  hasVoteToken={player.hasVoteToken}
                  highlight={playerIndex === selectedTokenIndex}
                  onClick={() => {
                    if (moveMode) {
                      if (selectedTokenIndex === undefined) {
                        setSelectedTokenIndex(playerIndex);
                      } else if (selectedTokenIndex === playerIndex) {
                        setSelectedTokenIndex(undefined);
                      } else {
                        const newPlayers = players.slice();
                        const playerA = newPlayers[playerIndex];
                        const playerB = newPlayers[selectedTokenIndex];
                        if (!playerA || !playerB)
                          throw new Error(
                            'Error when swapping two token positions',
                          );
                        newPlayers.splice(selectedTokenIndex, 1, playerA);
                        newPlayers.splice(playerIndex, 1, playerB);
                        setPlayers(newPlayers);
                        setSelectedTokenIndex(undefined);
                      }
                    } else {
                      setCurrentPlayerIndex(playerIndex);
                    }
                  }}
                />
              </div>
              {player.reminders
                .concat(player.automaticReminders)
                .map((reminder, reminderIndex) => (
                  <div
                    className='absolute w-[10%] min-w-[52px] -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-105 hover:cursor-pointer'
                    key={
                      key +
                      (reminder.characterId ?? 'reminder') +
                      reminder.message
                    }
                    style={{
                      left: toPercent(
                        (point.left - 0.5) * (1 - (reminderIndex + 1.6) / 5.5) +
                          0.5,
                      ),
                      top: toPercent(
                        (point.top - 0.5) * (1 - (reminderIndex + 1.6) / 5.5) +
                          0.5,
                      ),
                      zIndex: reminderIndex + 1,
                    }}
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to remove the "${reminder.message}" reminder token?`,
                        )
                      ) {
                        const newPlayer = players[playerIndex];
                        if (!newPlayer) {
                          throw new Error(
                            'Error when removing reminder token from player ' +
                              playerIndex.toString(),
                          );
                        }
                        newPlayer.reminders = newPlayer.reminders.toSpliced(
                          reminderIndex,
                          1,
                        );
                        const newPlayers = players.toSpliced(
                          playerIndex,
                          1,
                          newPlayer,
                        );
                        setPlayers(newPlayers);
                      }
                    }}
                    onDragStart={() => {
                      setDraggedReminder({
                        playerIndex,
                        reminderIndex,
                      });
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
    </>
  );
};

export default Grimoire;
