'use client';

import { IconExternalLink, IconScript, IconTrash } from '@tabler/icons-react';
import Button from 'components/input/button';
import Select from 'components/input/select';
import { Metadata } from 'next';
import { useEffect, useMemo, useState } from 'react';
import BotcCharacterSelectTable from './character-select';
import {
  CharacterId,
  Edition,
  EDITIONS,
  getAllCharacters,
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

const BOTC_GAME_STATE_KEY = 'botcGameState';
const BOTC_CUSTOM_SCRIPTS_KEY = 'botcCustomScripts';
const BOTC_NIGHT_ORDER_INDEX_KEY = 'botcNightOrderIndex';

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

const getCustomScripts = () => {
  return JSON.parse(
    localStorage.getItem(BOTC_CUSTOM_SCRIPTS_KEY) ?? '[]',
  ) as Edition[];
};

const addCustomScript = (edition: Edition) => {
  const customScripts = getCustomScripts();
  const newId = edition.name.toLowerCase().trim().replaceAll(' ', '-');
  const idx = customScripts.findIndex((edition) => edition.id === newId);
  if (idx !== -1) {
    customScripts.splice(idx, 1);
  }
  customScripts.push({ ...edition, id: newId });
  localStorage.setItem(BOTC_CUSTOM_SCRIPTS_KEY, JSON.stringify(customScripts));
};

const removeCustomScript = (id: string) => {
  const customScripts = getCustomScripts();
  const idx = customScripts.findIndex((edition) => edition.id === id);
  if (idx !== -1) {
    customScripts.splice(idx, 1);
  }
  localStorage.setItem(BOTC_CUSTOM_SCRIPTS_KEY, JSON.stringify(customScripts));
};

const BloodOnTheClocktowerElement = () => {
  const [gameState, _setGameState] = useState<BotcGame>(() => {
    const savedStateString = localStorage.getItem(BOTC_GAME_STATE_KEY);
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
  };

  const [nightOrderIndex, _setNightOrderIndex] = useState(() => {
    const storageValue = localStorage.getItem(BOTC_NIGHT_ORDER_INDEX_KEY);
    if (storageValue === null) {
      localStorage.setItem(BOTC_NIGHT_ORDER_INDEX_KEY, '0');
      return 0;
    } else {
      return parseInt(storageValue);
    }
  });
  const setNightOrderIndex = (n: number) => {
    _setNightOrderIndex(n);
    localStorage.setItem(BOTC_NIGHT_ORDER_INDEX_KEY, n.toString());
  };

  // Save game state after some delay to improve instant performance, as JSON.stringify might be slow
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (saveTimeout !== null) {
      clearTimeout(saveTimeout);
    }
    const timeout = setTimeout(() => {
      localStorage.setItem(BOTC_GAME_STATE_KEY, JSON.stringify(gameState));
      setSaveTimeout(null);
    }, 250);
    setSaveTimeout(timeout);
  }, [gameState]);

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

  const customScripts = getCustomScripts();
  const isCustomEdition =
    customScripts.find((script) => script.id === edition.id) !== undefined;

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
          <div className='flex max-w-lg gap-2'>
            <Select
              label='Edition'
              options={EDITIONS.map((e) => ({
                value: e.id,
                label: e.name,
              }))
                .concat(
                  customScripts.map((edition) => ({
                    value: edition.id,
                    label: edition.name,
                  })),
                )
                .concat([{ value: 'custom', label: 'New Custom Script...' }])}
              onChange={(v) => {
                setGameState(
                  new BotcGame({
                    edition:
                      EDITIONS.find((edition) => edition.id === v) ??
                      customScripts.find((edition) => edition.id === v) ??
                      CUSTOM_EDITION,
                  }),
                );
                setSelectedCharacters([]);
                setNightOrderIndex(0);
              }}
              value={edition.id}
            />
            {isCustomEdition && (
              <div className='translate-y-1.5'>
                <Button
                  onClick={() => {
                    if (confirm(`Do you want to remove '${edition.name}'?`)) {
                      removeCustomScript(edition.id);
                      setGameState(
                        new BotcGame({
                          edition: EDITIONS[0] ?? CUSTOM_EDITION,
                        }),
                      );
                    }
                  }}
                >
                  <IconTrash />
                  Remove
                </Button>
              </div>
            )}
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
                  label='Script URL/JSON'
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
                    onClick={async () => {
                      if (customScriptUrl) {
                        const newCustomScript =
                          await urlToEdition(customScriptUrl);
                        if (!newCustomScript) {
                          setCustomScriptUrlError(
                            'Can only parse either raw JSON, a Botcscripts JSON link, or a Pocket Grimoire character sheet link.',
                          );
                          return;
                        }
                        setCustomScriptUrlError('');
                        const newScriptName = prompt(
                          'Custom script name:',
                          newCustomScript.name,
                        );
                        if (!newScriptName) {
                          return;
                        }
                        newCustomScript.name = newScriptName;
                        newCustomScript.id = newScriptName
                          .trim()
                          .toLowerCase()
                          .replaceAll(' ', '-');
                        setGameState(
                          new BotcGame({
                            edition: newCustomScript,
                          }),
                        );
                        addCustomScript(newCustomScript);
                        setSelectedCharacters([]);
                        setCustomScriptUrl('');
                      }
                    }}
                  >
                    Import
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
              <Button
                href={`/botc/sheet?name=${encodeURIComponent(
                  edition.name,
                )}&characters=${encodeURIComponent(
                  getAllCharacters(edition).join(','),
                )}`}
                target='_blank'
              >
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
                  disabled={
                    selectedCharacters.length === 0 &&
                    'Select some characters first'
                  }
                  onClick={() => {
                    gameState.assignCharacters(selectedCharacters);
                    setGameState(gameState);
                    setNightOrderIndex(0);
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
        {gameState.players.find((player) => player.name !== undefined) ===
          undefined && (
          <div
            className={cn(
              'flex justify-center',
              tab !== 'grimoire' && 'hidden',
            )}
          >
            <Modal
              title='Draw characters'
              target={
                <Button
                  onClick={() => {
                    setSelectedCharacters(
                      gameState.players.map((player) => player.characterId),
                    );
                  }}
                >
                  Assign characters (starts at "First" and goes clockwise)
                </Button>
              }
              bgColor={drawCharactersBgColor}
              hideBackground
              withCloseButton
              stayOpenOnBackgroundClicked
              onBlur={() => {
                if (gameState.players.length === selectedCharacters.length) {
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
                fixedCharacterOrder
              />
            </Modal>
          </div>
        )}
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
