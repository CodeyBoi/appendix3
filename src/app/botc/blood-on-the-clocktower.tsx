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
  getAllCharacters,
} from './characters';
import NightOrder from './night-order';
import Grimoire from './grimoire';

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

  const edition = EDITIONS.find(
    (edition) => edition.id === gameState.editionId,
  );

  if (!edition) {
    return <div>NO EDITION FOUND</div>;
  }

  const detailsStartOpen = true;

  // TODO: Change this to alive players
  const alivePlayers = gameState.characters;

  return (
    <div className='flex max-w-3xl flex-col gap-2'>
      <h2>Bleck on the Corpstower</h2>
      <details open={detailsStartOpen} className='border p-2 shadow-md'>
        <summary className='select-none'>Setup</summary>

        <div className='h-2' />
        <Select
          label='Edition'
          options={EDITIONS.map((e) => ({ value: e.id, label: e.name })).concat(
            [{ value: 'custom', label: 'Custom Script' }],
          )}
          onChange={(v) => {
            setGameState({ ...gameState, characters: [], editionId: v });
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
        <Button
          onClick={() => {
            setGameState(newGameState);
          }}
        >
          Clear cache
        </Button>
      </details>
      <details open={detailsStartOpen} className='border p-2 shadow-md'>
        <summary className='select-none'>Grimoire</summary>
        <Grimoire
          players={gameState.players}
          characters={gameState.characters}
        />
      </details>
      <details open={detailsStartOpen} className='border p-2 shadow-md'>
        <summary className='select-none'>Night Order</summary>
        <div className='h-2' />
        <NightOrder
          alivePlayers={alivePlayers}
          numberOfPlayers={gameState.numberOfPlayers}
          allCharacters={getAllCharacters(edition)}
        />
      </details>
    </div>
  );
};

export default BloodOnTheClocktowerElement;
