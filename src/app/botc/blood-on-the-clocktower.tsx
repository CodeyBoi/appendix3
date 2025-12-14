'use client';

import { IconUser } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select, { SelectItem } from 'components/input/select';
import Modal from 'components/modal';
import { useSearchParamsState } from 'hooks/use-search-params-state';
import { Metadata } from 'next';
import { useState } from 'react';
import { range } from 'utils/array';

export const metadata: Metadata = {
  title: 'Blood on the Clocktower',
};

const MIN_PLAYERS = 5;
const MAX_PLAYERS = 15;

interface GameState {
  players: number;
  edition: string;
}

const newGameState: GameState = {
  players: 7,
  edition: 'trouble-brewing',
};

const editions: SelectItem[] = [
  'Trouble Brewing',
  'Bad Moon Rising',
  'Sects and Violets',
  'Custom Script',
].map((v) => ({ value: v.toLowerCase().replace(' ', '-'), label: v }));

const CHARACTER_TYPES = [
  'townsfolk',
  'outsiders',
  'minions',
  'demons',
] as const;
type CharacterType = (typeof CHARACTER_TYPES)[number];

const getNumberOfCharacters = (
  players: number,
): Record<CharacterType, number> => {
  if (players < 7) {
    return {
      townsfolk: 3,
      outsiders: players === 5 ? 0 : 1,
      minions: 1,
      demons: 1,
    };
  } else {
    const clampedPlayers = Math.min(players, MAX_PLAYERS);
    return {
      townsfolk: 5 + Math.floor((clampedPlayers - 7) / 3) * 2,
      outsiders: (clampedPlayers - 7) % 3,
      minions: 1 + Math.floor((clampedPlayers - 7) / 3),
      demons: 1,
    };
  }
};

const generateCharacterRow = (character: CharacterType) => {
  const color = ['townsfolk', 'outsiders'].includes(character)
    ? 'text-blue-500'
    : 'text-red-600';
  return (
    <tr className={color} key={character + 'amount'}>
      <td className='first-letter:capitalize'>{character}</td>
      {range(MIN_PLAYERS, MAX_PLAYERS + 1).map((n) => (
        <td key={character + n.toString()}>
          {getNumberOfCharacters(n)[character]}
        </td>
      ))}
    </tr>
  );
};

interface BloodOnTheClocktowerElementProps {
  state?: GameState;
}

const BloodOnTheClocktowerElement = ({
  state: stateProp = newGameState,
}: BloodOnTheClocktowerElementProps) => {
  const [_searchParamsgameState, _setSearchParamsGameState] =
    useSearchParamsState('state', JSON.stringify(stateProp));
  const [gameState, _setGameState] = useState<GameState>(stateProp);

  const setGameState = (newGameState: GameState) => {
    _setGameState(newGameState);
    _setSearchParamsGameState(JSON.stringify(newGameState));
  };

  return (
    <div className='flex max-w-3xl flex-col gap-2'>
      <h2>Blood On The Clocktower</h2>
      <details className='border p-2 shadow-md'>
        <summary className='select-none'>Setup</summary>

        <div className='h-2' />
        <Select
          label='Edition'
          options={editions}
          onChange={(v) => {
            setGameState({ ...gameState, edition: v });
          }}
        />
        <div className='h-2' />
        <Modal
          target={
            <Button>
              <IconUser />
              Select Characters
            </Button>
          }
          withCloseButton
        >
          <table className='font-xs'>
            <tbody>
              <tr className='bold'>
                <td>Players</td>
                {range(MIN_PLAYERS, MAX_PLAYERS).map((n) => (
                  <td key={n}>{n}</td>
                ))}
                <td>{MAX_PLAYERS}+</td>
              </tr>

              {CHARACTER_TYPES.map((t) => generateCharacterRow(t))}
            </tbody>
          </table>
          <input
            type='range'
            id='players'
            name='players'
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            defaultValue={gameState.players}
            onChange={(e) => {
              setGameState({
                ...gameState,
                players: e.currentTarget.valueAsNumber,
              });
            }}
          />
          <label htmlFor='players'>
            Number of players: {gameState.players}
          </label>
        </Modal>
        <div className='h-2' />

        <div className='h-2' />
      </details>
    </div>
  );
};

export default BloodOnTheClocktowerElement;
