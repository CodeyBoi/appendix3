import Select from 'components/input/select';
import { useMemo, useState } from 'react';
import NightOrderEntry from './night-order-entry';
import {
  BOTCPlayer,
  CharacterId,
  FIRST_NIGHT_TEXT,
  OTHER_NIGHTS_TEXT,
} from './characters';
import Switch from 'components/input/switch';

interface NightOrderProps {
  players: BOTCPlayer[];
  allCharacters: CharacterId[];
}

const NightOrder = ({ players, allCharacters }: NightOrderProps) => {
  const [showFirstNight, setShowFirstNight] = useState(true);
  const [showDeadCharacters, setShowDeadCharacters] = useState(false);
  const [showCharactersNotInPlay, setShowCharactersNotInPlay] = useState(false);

  const isTeensyville = allCharacters.length < 7;

  const allNightOrders = useMemo(
    () => ({
      firstNight: FIRST_NIGHT_TEXT.filter(([id, _]) =>
        allCharacters.includes(id),
      ),
      otherNights: OTHER_NIGHTS_TEXT.filter(([id, _]) =>
        allCharacters.includes(id),
      ),
    }),
    [allCharacters],
  );

  const gameCharacters = players.map((p) => p.characterId);
  const deadCharacters = players
    .filter((p) => p.isAlive)
    .map((p) => p.characterId);
  let nightOrder = showFirstNight
    ? allNightOrders.firstNight
    : allNightOrders.otherNights;
  if (!showCharactersNotInPlay) {
    nightOrder = nightOrder.filter(([id, _]) => gameCharacters.includes(id));
  }
  if (!showDeadCharacters) {
    nightOrder = nightOrder.filter(([id, _]) => !deadCharacters.includes(id));
  }

  return (
    <div>
      <Select
        label='Show'
        options={[
          { value: 'first', label: 'First night' },
          { value: 'other', label: 'Following nights' },
        ]}
        onChange={(v) => {
          setShowFirstNight(v === 'first');
        }}
      />
      <div className='h-2' />
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
      {nightOrder.map(([id, text]) => (
        <NightOrderEntry
          muted={!gameCharacters.includes(id)}
          key={`${id}night${showFirstNight ? 'FirstNight' : 'OtherNights'}`}
          characterId={id}
          text={text}
        />
      ))}
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
            setShowCharactersNotInPlay(!showCharactersNotInPlay);
          }}
        />
      </div>
    </div>
  );
};

export default NightOrder;
