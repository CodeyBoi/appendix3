'use client';

import { IconUser } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select, { SelectItem } from 'components/input/select';
import Modal from 'components/modal';
import { useSearchParamsState } from 'hooks/use-search-params-state';
import { Metadata } from 'next';
import { useState } from 'react';
import BOTCCharacterSelectTable from './character-select';
import { EDITIONS } from './characters';

export const metadata: Metadata = {
  title: 'Blood on the Clocktower',
};

interface GameState {
  numberOfPlayers: number;
  editionId: string;
}

const newGameState: GameState = {
  numberOfPlayers: 7,
  editionId: 'trouble-brewing',
};

const editions: SelectItem[] = [
  'Trouble Brewing',
  'Bad Moon Rising',
  'Sects and Violets',
  'Custom Script',
].map((v) => ({ value: v.toLowerCase().replace(' ', '-'), label: v }));

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

  const edition = EDITIONS.find((edition) => edition.id === gameState.editionId) ?? EDITIONS[0]

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
            setGameState({ ...gameState, editionId: v });
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
          <BOTCCharacterSelectTable
            numberOfPlayers={gameState.numberOfPlayers}
            onNumberOfPlayersChange={(n) =>
              setGameState({ ...gameState, numberOfPlayers: n })
            }
            edition={edition}
          />
        </Modal>
        <div className='h-2' />

        <div className='h-2' />
      </details>
    </div>
  );
};

export default BloodOnTheClocktowerElement;
