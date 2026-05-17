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
  toPocketGrimoireUrl,
  urlToEdition,
} from './characters';
import NightOrder from './night-order';
import Grimoire from './grimoire';
import { BotcGame, BotcPlayer } from './blood-on-the-clocktower-game';
import BotcActionsModal from './actions-modal';
import InfoTokenList from './info-token-list';
import Tabs from 'components/input/tabs';
import { useSearchParams } from 'next/navigation';
import TextInput from 'components/input/text-input';
import Modal, { ModalBackgroundColor } from 'components/modal';
import { shuffle } from 'utils/array';
import DrawCharacters from './draw-characters';
import { cn } from 'utils/class-names';
import NightOrderPreview from './night-order-preview';

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
      return savedState;
    } else {
      return newGameState;
    }
  });

  const setGameState = (state: BotcGame) => {
    _setGameState(new BotcGame(state));
    localStorage.setItem('botcGameState', JSON.stringify(state));
  };

  const [nightOrderIndex, _setNightOrderIndex] = useState(() => {
    const storageValue = localStorage.getItem('botcNightOrderIndex');
    if (storageValue === null) {
      localStorage.setItem('botcNightOrderIndex', '0');
      return 0;
    } else {
      return parseInt(storageValue);
    }
  });
  const setNightOrderIndex = (n: number) => {
    _setNightOrderIndex(n);
    localStorage.setItem('botcNightOrderIndex', n.toString());
  };

  const startGame = (players: BotcPlayer[]) => {
    gameState.startGame({ players });
    setGameState(gameState);
    setNightOrderIndex(0);
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
  const [customScriptUrlError, setCustomScriptUrlError] = useState('');

  const [selectedCharacters, setSelectedCharacters] = useState<CharacterId[]>(
    [],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [drawCharactersBgColor, setDrawCharactersBgColor] =
    useState<ModalBackgroundColor>('red');

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
        {tab === 'setup' && (
          <>
            <h2 className='hidden lg:block'>Bleck on the Corpstower</h2>
            <h3 className='lg:hidden'>Bleck on the Corpstower</h3>
          </>
        )}
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
        <div
          className={cn(
            'flex max-w-full flex-col gap-y-2',
            tab !== 'setup' && 'hidden',
          )}
        >
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
                setSelectedCharacters([]);
              }}
              value={gameState.edition.id}
            />
          </div>
          <Button
            onClick={() => {
              if (
                confirm(
                  'This will reset everything to a clean slate. Are you sure?',
                )
              ) {
                setSelectedCharacters([]);
                setGameState(newGameState);
              }
            }}
          >
            Clear cache
          </Button>
          {gameState.edition.id === 'custom' && (
            <div className='flex flex-col gap-4'>
              <div className='flex flex-wrap gap-x-4'>
                <TextInput
                  label='Script URL'
                  icon={<IconScript />}
                  onChange={(value) => {
                    setCustomScriptUrl(value);
                    setCustomScriptUrlError('');
                  }}
                  value={customScriptUrl}
                  error={customScriptUrlError}
                />
                <div className='flex gap-4'>
                  <Button
                    className='mt-2'
                    disabled={!customScriptUrl}
                    onClick={() => {
                      if (customScriptUrl) {
                        const edition = urlToEdition(customScriptUrl);
                        if (!edition) {
                          setCustomScriptUrlError(
                            'Can only parse either raw JSON or a Pocket Grimoire character sheet link.',
                          );
                          return;
                        }
                        setGameState(
                          new BotcGame({
                            edition,
                          }),
                        );
                        setCustomScriptUrl('');
                        setCustomScriptUrlError('');
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
                      setSelectedCharacters([]);
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
                selectedCharacters={selectedCharacters}
                onSelectedCharactersChange={setSelectedCharacters}
              />
              <div className='flex justify-end gap-2 lg:flex-row'>
                <Button
                  onClick={() => {
                    gameState.assignCharacters(selectedCharacters);
                    startGame(gameState.players);
                    setTab('grimoire');
                  }}
                >
                  Add all to Grimoire
                </Button>
                <Modal
                  title='Draw characters'
                  target={
                    <Button
                      onClick={() => {
                        setSelectedCharacters(
                          shuffle(selectedCharacters.slice()),
                        );
                      }}
                      disabled={
                        selectedCharacters.length === 0 &&
                        'Select some characters first'
                      }
                    >
                      Draw characters
                    </Button>
                  }
                  bgColor={drawCharactersBgColor}
                  hideBackground
                  withCloseButton
                  stayOpenOnBackgroundClicked
                  onBlur={() => {
                    if (
                      gameState.players.length === selectedCharacters.length
                    ) {
                      const bluffs = gameState.generateDemonBluffs();
                      gameState.demonBluffs = bluffs;
                      setGameState(gameState);
                      setTab('grimoire');
                    }
                  }}
                >
                  <DrawCharacters
                    characters={selectedCharacters}
                    startGame={startGame}
                    setModalBgColor={setDrawCharactersBgColor}
                  />
                </Modal>
              </div>
            </>
          )}
        </div>
        {}

        <div
          className={cn(
            'mb-16 flex flex-col justify-center divide-y rounded border shadow-md',
            tab !== 'grimoire' && 'hidden',
          )}
        >
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
            scriptCharacters={allCharacters}
          />
          <NightOrderPreview
            players={gameState.players}
            nightOrderIndex={nightOrderIndex}
            setNightOrderIndex={setNightOrderIndex}
          />
        </div>
        <span className={cn(tab !== 'night-order' && 'hidden')}>
          <NightOrder
            players={gameState.players}
            allCharacters={getAllCharacters(edition)}
            setCurrentPlayerIndex={(idx) => {
              setCurrentPlayerIndex(idx);
              setModalOpen(true);
            }}
          />
        </span>
        <span className={cn(tab !== 'info-tokens' && 'hidden')}>
          <InfoTokenList
            chosenCharacters={gameState.charactersInPlay()}
            allCharacters={gameState.scriptCharacters()}
            demonBluffs={gameState.demonBluffs}
            setDemonBluffs={(demonBluffs) => {
              gameState.demonBluffs = demonBluffs;
              setGameState(gameState);
            }}
          />
        </span>
      </div>
    </>
  );
};

export default BloodOnTheClocktowerElement;
