import {
  CharacterId,
  CHARACTERS,
  FIRST_NIGHT_TEXT,
  getImagePathFromId,
  OTHER_NIGHTS_TEXT,
} from './characters';
import { cn } from 'utils/class-names';

interface CharacterTokenProps {
  playerName?: string;
  characterId?: CharacterId;
  dead?: boolean;
  onClick?: () => void;
}

const FIRST_NIGHT_CHARACTERS = new Set(FIRST_NIGHT_TEXT.map(({ id }) => id));
const OTHER_NIGHT_CHARACTERS = new Set(OTHER_NIGHTS_TEXT.map(({ id }) => id));

const CharacterToken = ({
  playerName,
  characterId,
  dead = false,
  onClick = () => {},
}: CharacterTokenProps) => {
  const character = characterId ? CHARACTERS[characterId] : undefined;
  const hasLeftLeaf = characterId && FIRST_NIGHT_CHARACTERS.has(characterId);
  const hasRightLeaf = characterId && OTHER_NIGHT_CHARACTERS.has(characterId);

  const imgPath = character ? getImagePathFromId(character.id) : undefined;

  return (
    <div
      className={cn(
        'relative mt-1 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[repeat] bg-[url(/botc/token-noise.webp)] bg-auto text-center shadow-md transition-all hover:scale-105 hover:cursor-pointer',
        dead && 'grayscale',
      )}
      onClick={onClick}
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
        <img className='absolute h-full w-full' src='/botc/leaf-left.webp' />
      )}
      {hasRightLeaf && (
        <img className='absolute h-full w-full' src='/botc/leaf-right.webp' />
      )}
      {character && (
        <>
          <img
            className={cn(
              'absolute h-full w-full',
              imgPath?.includes('Fall_of_Rome') && 'scale-75',
            )}
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
  );
};

export default CharacterToken;
