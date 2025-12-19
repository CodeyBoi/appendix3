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

interface CharacterTokenProps {
  playerName?: string;
  characterId?: CharacterId;
  dead?: boolean;
  players: BOTCPlayer[];
  playerIndex: number;
  setPlayers: (newPlayers: BOTCPlayer[]) => void;
}

const FIRST_NIGHT_CHARACTERS = new Set(FIRST_NIGHT_TEXT.map(([id, _]) => id));
const OTHER_NIGHT_CHARACTERS = new Set(OTHER_NIGHTS_TEXT.map(([id, _]) => id));

const CharacterToken = ({
  playerName,
  characterId,
  dead = false,
  players,
  playerIndex,
  setPlayers,
}: CharacterTokenProps) => {
  const character = characterId ? CHARACTERS[characterId] : undefined;
  const hasLeftLeaf = characterId && FIRST_NIGHT_CHARACTERS.has(characterId);
  const hasRightLeaf = characterId && OTHER_NIGHT_CHARACTERS.has(characterId);
  const [modalOpen, setModalOpen] = useState(false);

  const killOrRevivePlayer = () => {
    const newPlayers = players.slice();
    const player = newPlayers[playerIndex];
    if (!player) throw new Error('Invalid playerIndex in CharacterToken');
    player.isAlive = dead;
    setModalOpen(false);
    setPlayers(newPlayers);
  };

  return (
    <Modal
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
                ></path>
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
      <Button onClick={killOrRevivePlayer}>
        {dead ? 'Revive' : 'Kill'} player
      </Button>
    </Modal>
  );
};

export default CharacterToken;
