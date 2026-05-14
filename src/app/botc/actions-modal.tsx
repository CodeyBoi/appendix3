'use client';

import { useMemo, useState } from 'react';
import { CharacterId, CHARACTERS, Reminder } from './characters';
import ReminderToken from './reminder-token';
import Modal from 'components/modal';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import Button from 'components/input/button';
import Switch from 'components/input/switch';
import Divider from 'components/divider';
import CharacterTokenSelector from './character-token-selector';
import InfoToken from './info-token';
import TextInput from 'components/input/text-input';

type SelectMode = 'none' | 'character' | 'player' | 'showToken' | 'name';

interface BotcActionsModalProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  playerIndex: number;
  players: BotcPlayer[];
  setPlayers: (newPlayers: BotcPlayer[]) => void;
  allCharacters?: CharacterId[];
}

const BotcActionsModal = ({
  open,
  setOpen,
  playerIndex,
  players,
  setPlayers,
  allCharacters = [],
}: BotcActionsModalProps) => {
  const player = players[playerIndex];

  if (!player) {
    return null;
  }

  const character = CHARACTERS[player.characterId];
  const [selectMode, setSelectMode] = useState<SelectMode>('none');
  const [showAllReminders, setShowAllReminders] = useState(false);
  const [addMultipleReminders, setAddMultipleReminders] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const characters = players.map((p) => p.characterId);
  const characterSet = new Set(characters);
  const charactersNotInPlay = allCharacters.filter(
    (characterId) => !characterSet.has(characterId),
  );
  const reminderTokens = useMemo(
    () =>
      (
        (showAllReminders
          ? allCharacters
          : allCharacters.filter((id) => characterSet.has(id))
        ).flatMap(
          (id) =>
            CHARACTERS[id].reminderTokens?.map((reminderText) => ({
              characterId: id,
              message: reminderText,
            })) ?? [],
        ) as Reminder[]
      ).concat([
        { characterId: 'good', message: 'Is Good' },
        { characterId: 'evil', message: 'Is Evil' },
      ]),
    [showAllReminders, allCharacters, characterSet],
  );

  const killOrRevivePlayer = () => {
    const newPlayers = players.slice();
    const player = newPlayers[playerIndex];
    if (!player) throw new Error('Invalid playerIndex when killing player');
    player.isAlive = !player.isAlive;
    setOpen(false);
    setPlayers(newPlayers);
  };

  const reminderHash = (reminder: Reminder) =>
    `id:${reminder.characterId},message:${reminder.message}`;
  const alreadyAdded = new Set(player.reminders.map(reminderHash));

  const filterReminderTokens = (reminder: Reminder) => {
    if (alreadyAdded.has(reminderHash(reminder))) {
      return false;
    }

    if (
      reminder.message === 'No ability' &&
      reminder.characterId !== player.characterId
    ) {
      return false;
    }

    return true;
  };

  return (
    <Modal
      title={
        selectMode === 'none'
          ? character.name + (player.name ? ` (${player.name})` : '')
          : selectMode === 'character'
          ? 'Replace Character Token'
          : selectMode === 'showToken'
          ? 'Show token'
          : selectMode === 'name'
          ? 'Set player name'
          : ''
      }
      withCloseButton
      open={open}
      onFocus={() => {
        setOpen(true);
        setSelectMode('none');
      }}
      onBlur={() => {
        setOpen(false);
      }}
      hideBackground={selectMode === 'showToken'}
    >
      {selectMode !== 'showToken' && character.description}
      {selectMode === 'none' && (
        <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
            <Button compact fullWidth onClick={killOrRevivePlayer}>
              {player.isAlive ? 'Kill' : 'Revive'}
            </Button>
            <Button
              compact
              fullWidth
              onClick={() => {
                setSelectMode('character');
              }}
            >
              Replace
            </Button>
            <Button
              compact
              fullWidth
              onClick={() => {
                setSelectMode('showToken');
              }}
            >
              Show
            </Button>
            <Button
              compact
              fullWidth
              onClick={() => {
                setPlayerName(player.name ?? '');
                setSelectMode('name');
              }}
            >
              Set name
            </Button>
          </div>
          <Divider />
          <div className='flex flex-col gap-2 px-2'>
            <h4>Add Reminder</h4>
            <div className='grid grid-cols-4 gap-2 md:flex md:flex-wrap'>
              {reminderTokens
                .filter(filterReminderTokens)
                .map(({ characterId, message }) => (
                  <div key={characterId + message} className='w-full md:w-20'>
                    <ReminderToken
                      onClick={() => {
                        const newPlayers = players.slice();
                        newPlayers[playerIndex]?.reminders.push({
                          characterId,
                          message,
                        });
                        setPlayers(newPlayers);
                        if (!addMultipleReminders) {
                          setOpen(false);
                        }
                      }}
                      characterId={characterId}
                      text={message}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className='h-2' />
          <div className='flex flex-col gap-4 md:flex-row'>
            <Switch
              label='Show tokens not in play'
              value={showAllReminders}
              onChange={setShowAllReminders}
            />
            <Switch
              label='Keep open after selecting'
              value={addMultipleReminders}
              onChange={setAddMultipleReminders}
            />
          </div>
          <div className='h-2' />
          <Button
            className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
            color='transparent'
            compact
            fullWidth
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to remove ${character.name}${
                    player.name ? ` (${player.name})` : ''
                  }?`,
                )
              ) {
                setPlayers(players.toSpliced(playerIndex, 1));
                setOpen(false);
              }
            }}
          >
            Remove character token
          </Button>
        </div>
      )}
      {selectMode === 'character' && (
        <CharacterTokenSelector
          characters={charactersNotInPlay}
          allCharacters={allCharacters}
          onChange={(id) => {
            const newPlayers = players.slice();
            const player = newPlayers[playerIndex];
            if (!player)
              throw new Error(
                'Invalid playerIndex when indexing during Replace Character Token',
              );
            player.characterId = id;
            setPlayers(newPlayers);
            setOpen(false);
          }}
        />
      )}
      {selectMode === 'showToken' && (
        <InfoToken
          className={player.alignment === 'good' ? 'bg-blue-500' : 'bg-red-600'}
          initialCharacters={[player.characterId]}
          characters={characters}
          allCharacters={allCharacters}
        />
      )}
      {selectMode === 'name' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newPlayers = players.slice();
            const p = newPlayers[playerIndex];
            if (!p) {
              throw new Error('Error when setting player name');
            }
            p.name = playerName;
            setPlayers(newPlayers);
            setPlayerName('');
            setOpen(false);
          }}
          className='flex items-center justify-center gap-2 rounded p-2'
        >
          <TextInput
            onChange={setPlayerName}
            value={playerName}
            label='Player name'
            autoFocus
          />
          <Button type='submit'>Done</Button>
        </form>
      )}
    </Modal>
  );
};

export default BotcActionsModal;
