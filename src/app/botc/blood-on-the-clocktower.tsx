'use client';

import { IconExternalLink, IconScript } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select from 'components/input/select';
import { Metadata } from 'next';
import { useMemo, useState } from 'react';
import BotcCharacterSelectTable from './character-select';
import {
  CharacterId,
  Edition,
  EDITIONS,
  getAllCharacters,
  parsePocketGrimoireUrl,
  toPocketGrimoireUrl,
} from './characters';
import NightOrder from './night-order';
import Grimoire from './grimoire';
import { BotcGame } from './blood-on-the-clocktower-game';
import BotcActionsModal from './actions-modal';
import InfoTokenList from './info-token-list';
import Tabs from 'components/input/tabs';
import { useSearchParams } from 'next/navigation';
import TextInput from 'components/input/text-input';

export const metadata: Metadata = {
  title: 'Blood on the Clocktower',
};

type Tab = 'setup' | 'grimoire' | 'night-order' | 'info-tokens';

const TROUBLE_BREWING = EDITIONS[0] as Edition;
const CUSTOM_EDITION: Edition = {
  name: 'Custom Script',
  id: 'custom',
  townsfolk: [],
  outsiders: [],
  minions: [],
  demons: [],
  travellers: [],
};
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

  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(
    (searchParams?.get('tab') ?? 'setup') as Tab,
  );
  const tabOptions: { label: string; value: Tab }[] =
    gameState.players.length === 0
      ? [{ label: 'Setup', value: 'setup' }]
      : [
          { label: 'Setup', value: 'setup' },
          { label: 'Grimoire', value: 'grimoire' },
          { label: 'Night Order', value: 'night-order' },
          { label: 'Info Tokens', value: 'info-tokens' },
        ];

  const [customScriptUrl, setCustomScriptUrl] = useState('');

  const [selectedCharacters, setSelectedCharacters] = useState<CharacterId[]>(
    [],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const startGame = () => {
    gameState.assignCharacters(selectedCharacters);
    if (gameState.players.length > 0) {
      setGameState(gameState);
      setTab('grimoire');
    }
  };

  const edition = gameState.edition;

  const allCharacters = useMemo(() => getAllCharacters(edition), [edition]);

  return (
    <>
      <BotcActionsModal
        open={modalOpen}
        setOpen={setModalOpen}
        playerIndex={currentPlayerIndex}
        players={gameState.players}
        setPlayers={(players) => {
          gameState.players = players;
          setGameState(gameState);
        }}
        allCharacters={allCharacters}
      />
      <div className='flex flex-col gap-2 lg:max-w-3xl'>
        <h2 className='hidden lg:block'>Bleck on the Corpstower</h2>
        <h3 className='lg:hidden'>Bleck on the Corpstower</h3>
        <span className='text-sm'>
          <Tabs
            defaultTab='setup'
            options={tabOptions}
            onTabChange={(t) => {
              setTab(t as Tab);
            }}
            tab={tab}
          />
        </span>
        {tab === 'setup' && (
          <div className='flex max-w-full flex-col gap-y-2'>
            <div className='max-w-md'>
              <Select
                label='Edition'
                options={EDITIONS.map((e) => ({
                  value: e.id,
                  label: e.name,
                })).concat([{ value: 'custom', label: 'Custom Script' }])}
                onChange={(v) => {
                  setGameState(
                    new BotcGame({
                      edition:
                        EDITIONS.find((edition) => edition.id === v) ??
                        CUSTOM_EDITION,
                    }),
                  );
                }}
                value={gameState.edition.id}
              />
            </div>
            {gameState.edition.id === 'custom' && (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-wrap gap-x-4'>
                  <TextInput
                    label='Script URL'
                    icon={<IconScript />}
                    onChange={setCustomScriptUrl}
                    value={customScriptUrl}
                  />
                  <div className='flex gap-4'>
                    <Button
                      className='mt-2'
                      disabled={!customScriptUrl}
                      onClick={() => {
                        if (customScriptUrl) {
                          setGameState(
                            new BotcGame({
                              edition: parsePocketGrimoireUrl(customScriptUrl),
                            }),
                          );
                          setCustomScriptUrl('');
                        }
                      }}
                    >
                      Import
                    </Button>
                    <Button
                      className='mt-2'
                      disabled={!customScriptUrl && allCharacters.length === 0}
                      onClick={() => {
                        setGameState(new BotcGame({ edition: CUSTOM_EDITION }));
                        setCustomScriptUrl('');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                {allCharacters.length > 0 && (
                  <h4>Loaded script: {edition.name}</h4>
                )}
              </div>
            )}
            {allCharacters.length > 0 && (
              <>
                <Button href={toPocketGrimoireUrl(edition)} target='_blank'>
                  Character Sheet
                  <IconExternalLink />
                </Button>
                <BotcCharacterSelectTable
                  edition={edition}
                  onSelectedCharactersChange={(characters) => {
                    setSelectedCharacters(characters);
                  }}
                />
                <div className='flex justify-end gap-2 lg:flex-row'>
                  <Button
                    onClick={() => {
                      if (
                        confirm(
                          'This will reset everything to a clean slate. Are you sure?',
                        )
                      ) {
                        setGameState(newGameState);
                      }
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    disabled={
                      selectedCharacters.length === 0 &&
                      'Select some characters first'
                    }
                    onClick={startGame}
                  >
                    Start game
                  </Button>
                </div>
                <div className='flex gap-4'>
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
                        { name: 'Göran' },
                        { name: 'Långtnamnsomingenbordeha' },
                        { name: 'Svanslös' },
                        { name: 'Svansfull' },
                        { name: 'Stor Person' },
                        { name: 'Adam' },
                        { name: 'Tim' },
                      ];
                      setGameState(gameState);
                    }}
                  >
                    Populate lobby
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
        {tab === 'grimoire' && (
          <div className='flex justify-center rounded border shadow-md'>
            <Grimoire
              players={gameState.players}
              setPlayers={(players) => {
                gameState.players = players;
                setGameState(gameState);
              }}
              setCurrentPlayerIndex={(idx) => {
                setCurrentPlayerIndex(idx);
                setModalOpen(true);
              }}
            />
          </div>
        )}
        {tab === 'night-order' && (
          <NightOrder
            players={gameState.players}
            allCharacters={getAllCharacters(edition)}
          />
        )}
        {tab === 'info-tokens' && (
          <InfoTokenList
            chosenCharacters={gameState.charactersInPlay()}
            allCharacters={gameState.characters()}
          />
        )}
      </div>
    </>
  );
};

export default BloodOnTheClocktowerElement;
