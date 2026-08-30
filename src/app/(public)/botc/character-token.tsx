import { IconFileCheck } from '@tabler/icons-react';
import {
  Alignment,
  CharacterId,
  CHARACTERS,
  getDefaultAlignment,
} from './characters';
import { cn } from 'utils/class-names';

interface CharacterTokenProps {
  playerName?: string;
  characterId?: CharacterId;
  dead?: boolean;
  onClick?: () => void;
  alignment?: Alignment;
  hasVoteToken?: boolean;
  highlight?: boolean;
}

const CharacterToken = ({
  playerName,
  characterId,
  dead = false,
  onClick = () => {},
  alignment = characterId ? getDefaultAlignment(characterId) : undefined,
  hasVoteToken = false,
  highlight = false,
}: CharacterTokenProps) => {
  const character = characterId ? CHARACTERS[characterId] : undefined;
  const hasLeftLeaf = character?.nightReminders.first !== undefined;
  const hasRightLeaf = character?.nightReminders.other !== undefined;
  const shouldBeUpsideDown =
    alignment && characterId
      ? getDefaultAlignment(characterId) !== alignment
      : false;

  const imgPath = character?.image?.[0];
  const nameColor =
    alignment === 'good'
      ? 'bg-blue-500'
      : alignment === 'evil'
      ? 'bg-red-600'
      : 'bg-neutral-500';
  const textColor =
    alignment === 'good'
      ? 'text-blue-700'
      : alignment === 'evil'
      ? 'text-red-800'
      : 'text-neutral-500';

  return (
    <div
      className={cn(
        'relative mt-1 aspect-square w-full rounded-full bg-[repeat] bg-[url(/botc/token-noise.webp)] bg-auto text-center shadow-md transition-all hover:scale-105 hover:cursor-pointer',
        dead && 'grayscale',
        highlight &&
          `shadow-xl ${
            alignment === 'evil' ? 'shadow-red-300' : 'shadow-blue-400'
          }`,
      )}
      onClick={onClick}
    >
      {playerName && (
        <h5
          className={cn(
            'absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded px-2 text-xs text-white lg:text-sm',
            nameColor,
          )}
        >
          {playerName}
        </h5>
      )}
      <span className={cn(shouldBeUpsideDown && 'rotate-180')}>
        <img
          className='absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2'
          src='/botc/clockface.webp'
          loading='lazy'
          draggable={false}
        />
        {hasLeftLeaf && (
          <img
            className='absolute h-full w-full'
            src='/botc/leaf-left.webp'
            draggable={false}
          />
        )}
        {hasRightLeaf && (
          <img
            className='absolute h-full w-full'
            src='/botc/leaf-right.webp'
            draggable={false}
          />
        )}
        {dead && hasVoteToken && (
          <IconFileCheck
            stroke={2}
            color='white'
            size={56}
            className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'
          />
        )}
        {character && (
          <>
            <img
              className={cn(
                'absolute h-full w-full',
                (imgPath?.includes('Fall_of_Rome') ||
                  imgPath?.includes('Muppets_on_a_Clocktower')) &&
                  'scale-75',
                imgPath?.includes('Murder_on_the_Dancefloor') && 'scale-[0.65]',
              )}
              src={imgPath}
              loading='lazy'
              draggable={false}
            />
            <svg viewBox='0 0 150 150'>
              <text textAnchor='middle' className={textColor}>
                <textPath
                  startOffset='50%'
                  href='#botc-token-character-curve'
                  className='fill-current'
                >
                  {character.name}
                </textPath>
              </text>
            </svg>
          </>
        )}
      </span>
    </div>
  );
};

export default CharacterToken;
