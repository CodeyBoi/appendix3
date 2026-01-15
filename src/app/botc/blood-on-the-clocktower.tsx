'use client';

import { IconScript, IconUser } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select from 'components/input/select';
import Modal from 'components/modal';
import { Metadata } from 'next';
import { useState } from 'react';
import BOTCCharacterSelectTable from './character-select';
import { CharacterId, Edition, EDITIONS, getAllCharacters } from './characters';
import NightOrder from './night-order';
import Grimoire from './grimoire';
import ParamsTextInput from 'components/input/params-text-input';
import { BotcGame } from './blood-on-the-clocktower-game';

export const metadata: Metadata = {
  title: 'Blood on the Clocktower',
};

const TROUBLE_BREWING = EDITIONS[0] as Edition;
const newGameState = new BotcGame({ edition: TROUBLE_BREWING });

const BloodOnTheClocktowerElement = () => {
  const [gameState, _setGameState] = useState<BotcGame>(() => {
    const savedStateString = localStorage.getItem('botcGameState');
    if (savedStateString) {
      const savedState = new BotcGame(
        JSON.parse(savedStateString) as InstanceType<typeof BotcGame>,
      );
      console.log('Got value ' + savedStateString + ' from localStorage');
      return savedState;
    } else {
      console.log('No game state found in localstorage. Using default...');
      return newGameState;
    }
  });

  const setGameState = (state: BotcGame) => {
    _setGameState(new BotcGame(state));
    localStorage.setItem('botcGameState', JSON.stringify(state));
  };

  const [selectedCharacters, setSelectedCharacters] = useState<CharacterId[]>(
    [],
  );

  const assignCharacters = () => {
    console.log('assinging characters');
    gameState.assignCharacters(selectedCharacters);
    setGameState(gameState);
  };

  const edition = gameState.edition;

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
            setGameState(
              new BotcGame({
                edition:
                  EDITIONS.find((edition) => edition.id === v) ??
                  (EDITIONS[0] as Edition),
              }),
            );
          }}
          value={gameState.edition.id}
        />
        {gameState.edition.id === 'custom' && (
          <ParamsTextInput
            label='Script URL'
            icon={<IconScript />}
            paramName='scriptUrl'
          />
        )}
        <div className='h-2' />
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
                setSelectedCharacters(characters);
              }}
            />
          </Modal>
          <Button
            disabled={
              selectedCharacters.length === 0 && 'Select some characters first'
            }
            onClick={assignCharacters}
          >
            Assign characters
          </Button>
        </div>
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
              gameState.lobby = [
                { name: 'Hannes' },
                { name: 'Hannes2' },
                { name: 'Bartolomeus' },
                { name: 'Kyoto' },
                { name: 'Jörgen' },
                { name: 'Pratkvarn' },
                { name: 'Pelle' },
                { name: 'Lars' },
              ];
              setGameState(gameState);
            }}
          >
            Populate lobby
          </Button>
        </div>
      </details>
      {gameState.players.length > 0 && (
        <>
          <details open={detailsStartOpen} className='border p-2 shadow-md'>
            <summary className='select-none'>Grimoire</summary>
            <Grimoire
              edition={edition}
              players={gameState.players}
              setPlayers={(players) => {
                gameState.players = players;
                setGameState(gameState);
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
