import { cn } from 'utils/class-names';
import {
  Alignment,
  CharacterId,
  CHARACTERS,
  getDefaultAlignment,
} from './characters';

interface ReminderTokenProps {
  characterId?: CharacterId | 'good' | 'evil';
  text: string;
  onClick?: () => void;
}

const ALIGNMENT_IMG_SRCS: Record<Alignment, string> = {
  good: '/botc/good.webp',
  evil: '/botc/evil.webp',
};
const isCharacterId = (id?: CharacterId | 'good' | 'evil'): id is CharacterId =>
  id !== 'good' && id !== 'evil' && id !== undefined;

const ReminderToken = ({ characterId, text, onClick }: ReminderTokenProps) => {
  const isCharacter = isCharacterId(characterId);
  const character = isCharacter ? CHARACTERS[characterId] : undefined;
  const defaultAlignment =
    isCharacter && character ? getDefaultAlignment(character.id) : characterId;
  const imgSrc =
    characterId === undefined
      ? undefined
      : isCharacter
      ? character?.image?.[0]
      : ALIGNMENT_IMG_SRCS[characterId];
  return (
    <div
      className={cn(
        'relative aspect-square w-full rounded-full shadow-md hover:cursor-pointer',
        defaultAlignment === 'good' ? 'bg-blue-900' : 'bg-red-900',
      )}
      draggable
      onClick={onClick}
    >
      {imgSrc !== undefined && (
        <img
          className={cn(
            'absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2',
            imgSrc.includes('Fall_of_Rome') && 'scale-75',
          )}
          src={imgSrc}
          loading='lazy'
        />
      )}
      {character && (
        <svg viewBox='0 0 150 150' className='absolute'>
          <path
            d='M 13 75 C 13 0, 138 0, 138 75'
            id='top-curve'
            fill='transparent'
          />
          <text className='translate-y-2' textAnchor='middle' fontSize={22}>
            <textPath
              className='fill-white stroke-white stroke-1'
              startOffset='50%'
              href='#top-curve'
            >
              {character.name}
            </textPath>
          </text>
        </svg>
      )}
      <svg viewBox='0 0 150 150' className='absolute'>
        <path
          d='M 13 75 C 13 160, 138 160, 138 75'
          id='bottom-curve'
          fill='transparent'
        />
        <text textAnchor='middle' fontSize={22}>
          <textPath
            className='fill-white stroke-white stroke-0'
            startOffset='50%'
            href='#bottom-curve'
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default ReminderToken;
