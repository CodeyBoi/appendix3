import Modal from 'components/modal';
import {
  BOTCPlayer,
  CharacterId,
  CHARACTERS,
  FIRST_NIGHT_TEXT,
  getImagePathFromId,
  OTHER_NIGHTS_TEXT,
} from './characters';
import { cn } from 'utils/class-names';
import Button from 'components/input/button';
import { useState } from 'react';
import ReminderToken from './reminder-token';
import Switch from 'components/input/switch';

interface CharacterTokenProps {
  playerName?: string;
  characterId?: CharacterId;
  dead?: boolean;
  players: BOTCPlayer[];
  playerIndex: number;
  setPlayers: (newPlayers: BOTCPlayer[]) => void;
  allCharacters?: CharacterId[];
}

const FIRST_NIGHT_CHARACTERS = new Set(FIRST_NIGHT_TEXT.map(({ id }) => id));
const OTHER_NIGHT_CHARACTERS = new Set(OTHER_NIGHTS_TEXT.map(({ id }) => id));

type SelectMode = 'none' | 'reminder';

const CharacterToken = ({
  playerName,
  characterId,
  dead = false,
  players,
  playerIndex,
  setPlayers,
  allCharacters = [],
}: CharacterTokenProps) => {
  const character = characterId ? CHARACTERS[characterId] : undefined;
  const hasLeftLeaf = characterId && FIRST_NIGHT_CHARACTERS.has(characterId);
  const hasRightLeaf = characterId && OTHER_NIGHT_CHARACTERS.has(characterId);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectMode, setSelectMode] = useState<SelectMode>('none');
  const [showAllReminders, setShowAllReminders] = useState(false);

  const killOrRevivePlayer = () => {
    const newPlayers = players.slice();
    const player = newPlayers[playerIndex];
    if (!player) throw new Error('Invalid playerIndex in CharacterToken');
    player.isAlive = dead;
    setModalOpen(false);
    setPlayers(newPlayers);
  };

  const canKill = character?.reminderTokens?.includes('Killed by') ?? false;

  return (
    <Modal
      title={
        selectMode === 'none'
          ? character
            ? character.name + (playerName ? ` (${playerName})` : '')
            : 'Empty Token'
          : 'Add reminder token'
      }
      withCloseButton
      open={modalOpen}
      onFocus={() => {
        setModalOpen(true);
      }}
      onBlur={() => {
        setModalOpen(false);
      }}
      target={
        <div
          className={cn(
            'relative mt-1 h-32 w-32 rounded-full bg-[repeat] bg-[url(/botc/token-noise.webp)] bg-auto text-center shadow-md',
            dead && 'grayscale',
          )}
        >
          <h5 className='absolute -top-1 left-1/2 -translate-x-1/2 rounded bg-red-600 px-2 text-white'>
            {playerName}
          </h5>
          <img
            className='absolute left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2'
            src='/botc/clockface.webp'
            loading='lazy'
          />
          {hasLeftLeaf && (
            <img
              className='absolute h-full w-full'
              src='/botc/leaf-left.webp'
            />
          )}
          {hasRightLeaf && (
            <img
              className='absolute h-full w-full'
              src='/botc/leaf-right.webp'
            />
          )}
          {character && (
            <>
              <img
                className='absolute h-full w-full'
                src={getImagePathFromId(character.id)}
                loading='lazy'
              />
              <svg viewBox='0 0 150 150'>
                <path
                  d='M 13 75 C 13 160, 138 160, 138 75'
                  id='curve'
                  fill='transparent'
                />
                <text textAnchor='middle'>
                  <textPath startOffset='50%' href='#curve'>
                    {character.name}
                  </textPath>
                </text>
              </svg>
            </>
          )}
        </div>
      }
    >
      {character?.description}
      {selectMode === 'none' && (
        <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
          <Button fullWidth onClick={killOrRevivePlayer}>
            {dead ? 'Revive' : 'Kill'} this player
          </Button>
          <Button fullWidth disabled={!canKill} onClick={killOrRevivePlayer}>
            Kill another player
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setSelectMode('reminder');
            }}
          >
            Add reminder
          </Button>
        </div>
      )}
      {selectMode === 'reminder' && (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-4 gap-y-2 md:grid-cols-5 lg:grid-cols-7'>
            {(showAllReminders
              ? allCharacters
              : players.flatMap((p) => p.characterId)
            ).flatMap(
              (id) =>
                CHARACTERS[id].reminderTokens?.map((reminderText) => (
                  <ReminderToken
                    key={id + reminderText}
                    onClick={() => {
                      const newPlayers = players.slice();
                      newPlayers[playerIndex]?.reminders.push({
                        characterId: id,
                        message: reminderText,
                      });
                      setPlayers(newPlayers);
                      setModalOpen(false);
                    }}
                    characterId={id}
                    text={reminderText}
                  />
                )) ?? [],
            )}
          </div>
          <Switch
            label='Show all reminders'
            value={showAllReminders}
            onChange={setShowAllReminders}
          />
        </div>
      )}
    </Modal>
  );
};

export default CharacterToken;
