'use client';

import { IconScript, IconUser } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select from 'components/input/select';
import Modal from 'components/modal';
import { useSearchParamsState } from 'hooks/use-search-params-state';
import { Metadata } from 'next';
import { useState } from 'react';
import BOTCCharacterSelectTable from './character-select';
import {
  BOTCPlayer,
  CharacterId,
  createPlayer,
  EDITIONS,
  getAllCharacters,
} from './characters';
import NightOrder from './night-order';
import Grimoire from './grimoire';
import { shuffle, zip } from 'utils/array';
import ParamsTextInput from 'components/input/params-text-input';

export const metadata: Metadata = {
  title: 'Blood on the Clocktower',
};

interface GameState {
  editionId: string;
  characters: CharacterId[];
  lobby: { name: string; corpsId?: string }[];
  players: BOTCPlayer[];
}

const newGameState: GameState = {
  editionId: 'trouble-brewing',
  characters: [],
  players: [],
  lobby: [],
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

  const assignCharacters = () => {
    const players = zip(
      shuffle(gameState.characters.slice()),
      gameState.lobby,
    ).map(([characterId, player], index) =>
      createPlayer({ ...player, characterId, index }),
    );
    setGameState({
      ...gameState,
      lobby: gameState.lobby.slice(players.length),
      players,
    });
  };

  const edition = EDITIONS.find(
    (edition) => edition.id === gameState.editionId,
  );

  const detailsStartOpen = true;

  return (
    <div className='flex max-w-3xl flex-col gap-2'>
      <h2 className='hidden lg:block'>Bleck on the Corpstower</h2>
      <h3 className='lg:hidden'>Bleck on the Corpstower</h3>
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
        {gameState.editionId === 'custom' && (
          <ParamsTextInput
            label='Script URL'
            icon={<IconScript />}
            paramName='scriptUrl'
          />
        )}
        <div className='h-2' />
        {edition && (
          <div className='flex flex-col gap-2 lg:flex-row'>
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
                edition={edition}
                onSelectedCharactersChange={(characters) => {
                  setGameState({ ...gameState, characters });
                }}
              />
            </Modal>
            <Button
              disabled={
                gameState.characters.length === 0 &&
                'Select some characters first'
              }
              onClick={assignCharacters}
            >
              Assign characters
            </Button>
          </div>
        )}
        <div className='h-2' />
        <div className='flex gap-4'>
          <Button
            onClick={() => {
              setGameState(newGameState);
            }}
          >
            Clear cache
          </Button>
          <Button
            onClick={() => {
              setGameState({
                ...gameState,
                lobby: [
                  { name: 'Hannes' },
                  { name: 'Hannes2' },
                  { name: 'Bartolomeus' },
                  { name: 'Kyoto' },
                  { name: 'Jörgen' },
                  { name: 'Pratkvarn' },
                  { name: 'Pelle' },
                  { name: 'Lars' },
                ],
              });
            }}
          >
            Populate lobby
          </Button>
        </div>
      </details>
      {edition && gameState.players.length > 0 && (
        <>
          <details open={detailsStartOpen} className='border p-2 shadow-md'>
            <summary className='select-none'>Grimoire</summary>
            <Grimoire
              edition={edition}
              players={gameState.players}
              setPlayers={(players) => {
                setGameState({ ...gameState, players });
              }}
            />
          </details>
          <details open={detailsStartOpen} className='border p-2 shadow-md'>
            <summary className='select-none'>Night Order</summary>
            <div className='h-2' />
            <NightOrder
              players={gameState.players}
              allCharacters={getAllCharacters(edition)}
            />
          </details>
        </>
      )}
    </div>
  );
};

export default BloodOnTheClocktowerElement;
