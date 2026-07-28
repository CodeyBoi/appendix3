import Select from 'components/input/select';
import { useState } from 'react';
import NightOrderEntry from './night-order-entry';
import { CharacterId, CHARACTERS } from './characters';
import Switch from 'components/input/switch';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import { cn } from 'utils/class-names';

interface NightOrderProps {
  players: BotcPlayer[];
  allCharacters: CharacterId[];
  setCurrentPlayerIndex: (n: number) => void;
}

export const getNightOrder = (characterIds: CharacterId[]) => {
  const characters = characterIds
    .filter((id, i) => i === characterIds.indexOf(id))
    .map((id) => CHARACTERS[id]);
  return {
    firstNight: characters
      .flatMap((character) =>
        character.nightReminders.first
          ? [
              {
                ...character.nightReminders.first,
                id: character.id,
                description: character.nightReminders.first.text,
              },
            ]
          : [],
      )
      .sort((a, b) => a.index - b.index),
    otherNights: characters
      .flatMap((character) =>
        character.nightReminders.other
          ? [
              {
                ...character.nightReminders.other,
                id: character.id,
                description: character.nightReminders.other.text,
              },
            ]
          : [],
      )
      .sort((a, b) => a.index - b.index),
  };
};

const NightOrder = ({
  players,
  allCharacters: allCharacterIds,
  setCurrentPlayerIndex,
}: NightOrderProps) => {
  const [showFirstNight, setShowFirstNight] = useState(true);
  const [showDeadCharacters, setShowDeadCharacters] = useState(false);
  const [showCharactersNotInPlay, setShowCharactersNotInPlay] = useState(false);

  const isTeensyville = players.length < 7;

  const allNightOrders = getNightOrder(allCharacterIds);

  const gameCharacters = players.map((p) => p.characterId);
  const deadCharacters = players
    .filter((p) => !p.isAlive)
    .map((p) => p.characterId);
  let nightOrder = showFirstNight
    ? allNightOrders.firstNight
    : allNightOrders.otherNights;
  if (!showCharactersNotInPlay) {
    nightOrder = nightOrder.filter(({ id }) => gameCharacters.includes(id));
  }
  if (!showDeadCharacters) {
    nightOrder = nightOrder.filter(({ id }) => !deadCharacters.includes(id));
  }

  return (
    <div className='flex flex-col divide-y'>
      {!isTeensyville && showFirstNight && (
        <>
          <NightOrderEntry
            name='Minions'
            text='Wake all the Minions and show them the Demon.'
          />
          <NightOrderEntry
            name='Demon'
            text='Wake the Demon, show them their minions and their 3 bluffs (characters not in play).'
          />
        </>
      )}
      {nightOrder.map(({ id, description }) => {
        const playerIndex = players.findIndex(
          (player) => player.characterId === id,
        );
        return (
          <div
            key={`${id}night${showFirstNight ? 'FirstNight' : 'OtherNights'}`}
            className={cn(
              playerIndex !== -1 && 'hover:cursor-pointer hover:bg-red-600/10',
            )}
            onClick={
              playerIndex !== -1
                ? () => {
                    setCurrentPlayerIndex(playerIndex);
                  }
                : undefined
            }
          >
            <NightOrderEntry
              name={players
                .filter((p) => p.characterId === id)
                .filter((p) => p.name?.trim())
                .map((p) => p.name)
                .join(', ')}
              muted={
                deadCharacters.includes(id) || !gameCharacters.includes(id)
              }
              characterId={id}
              text={description}
            />
          </div>
        );
      })}
      <div className='h-2' />
      <Select
        label='Show nights'
        options={[
          { value: 'first', label: 'First night' },
          { value: 'other', label: 'Following nights' },
        ]}
        onChange={(v) => {
          setShowFirstNight(v === 'first');
        }}
      />
      <div className='flex flex-col gap-4 p-2 pt-3 lg:flex-row'>
        <Switch
          label='Show dead characters'
          value={showDeadCharacters}
          onChange={() => {
            setShowDeadCharacters(!showDeadCharacters);
          }}
        />
        <Switch
          label='Show characters not in play'
          value={showCharactersNotInPlay}
          onChange={() => {
            if (!showCharactersNotInPlay) {
              setShowCharactersNotInPlay(true);
              setShowDeadCharacters(true);
            } else {
              setShowCharactersNotInPlay(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default NightOrder;
