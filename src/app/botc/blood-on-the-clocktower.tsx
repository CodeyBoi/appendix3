'use client';

import { IconUser } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select from 'components/input/select';
import Modal from 'components/modal';
import { useSearchParamsState } from 'hooks/use-search-params-state';
import { Metadata } from 'next';
import { useState } from 'react';
import BOTCCharacterSelectTable from './character-select';
import {
  BOTCPlayer,
  CharacterID,
  EDITIONS,
  FIRST_NIGHT_TEXT,
  OTHER_NIGHTS_TEXT,
} from './characters';
import NightOrderEntry from './night-order-entry';
import Switch from 'components/input/switch';

export const metadata: Metadata = {
  title: 'Blood on the Clocktower',
};

interface GameState {
  numberOfPlayers: number;
  editionId: string;
  characters: CharacterID[];
  players: BOTCPlayer[];
}

const newGameState: GameState = {
  numberOfPlayers: 7,
  editionId: 'trouble-brewing',
  characters: [],
  players: [],
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

  const [showFirstNight, setShowFirstNight] = useState(true);
  const [showDeadCharacters, setShowDeadCharacters] = useState(false);
  const [showCharactersNotInPlay, setShowCharactersNotInPlay] = useState(false);

  const edition = EDITIONS.find(
    (edition) => edition.id === gameState.editionId,
  );
  const isTeensyville = gameState.numberOfPlayers < 7;

  if (!edition) {
    return <div>NO EDITION FOUND</div>;
  }

  const demon = gameState.characters.find((c) => edition.demons.includes(c));

  // TODO: Change this to alive players
  const alivePlayers = gameState.characters;

  return (
    <div className='flex max-w-3xl flex-col gap-2'>
      <h2>Blood On The Clocktower</h2>
      <details className='border p-2 shadow-md'>
        <summary className='select-none'>Setup</summary>

        <div className='h-2' />
        <Select
          label='Edition'
          options={EDITIONS.map((e) => ({ value: e.id, label: e.name })).concat(
            [{ value: 'custom', label: 'Custom Script' }],
          )}
          onChange={(v) => {
            setGameState({ ...gameState, editionId: v });
          }}
          value={gameState.editionId}
        />
        <div className='h-2' />
        <Modal
          title={`Select Characters - ${edition.name}`}
          target={
            <Button>
              <IconUser />
              Select Characters
            </Button>
          }
          withCloseButton
        >
          <BOTCCharacterSelectTable
            numberOfPlayers={gameState.numberOfPlayers}
            onNumberOfPlayersChange={(n) => {
              setGameState({ ...gameState, numberOfPlayers: n });
            }}
            edition={edition}
            onSelectedCharactersChange={(characters) => {
              setGameState({ ...gameState, characters });
            }}
          />
        </Modal>
        <div className='h-2' />
      </details>
      <details className='border p-2 shadow-md'>
        <summary className='select-none'>Grimoire</summary>
      </details>
      <details className='border p-2 shadow-md'>
        <summary className='select-none'>Night Order</summary>
        <div className='h-2' />
        <Select
          label='Show'
          options={[
            { value: 'first', label: 'First night' },
            { value: 'other', label: 'Other nights' },
          ]}
          onChange={(v) => {
            setShowFirstNight(v === 'first');
          }}
        />
        <div className='h-2' />
        <div className='flex gap-4'>
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
        <div className='h-2' />
        {!isTeensyville && showFirstNight && (
          <>
            {demon && (
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
          </>
        )}
        {(showFirstNight ? FIRST_NIGHT_TEXT : OTHER_NIGHTS_TEXT)
          .filter(([id, _]) => alivePlayers.includes(id))
          .map(([id, text]) => (
            <NightOrderEntry
              key={`${id}night${showFirstNight ? 1 : 2}`}
              characterId={id}
              text={text}
            />
          ))}
      </details>
    </div>
  );
};

export default BloodOnTheClocktowerElement;
