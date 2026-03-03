import { cn } from 'utils/class-names';
import { CharacterId, CHARACTERS, getImagePathFromId } from './characters';

interface ReminderTokenProps {
  characterId: CharacterId;
  text: string;
  onClick?: () => void;
}

const ReminderToken = ({ characterId, text, onClick }: ReminderTokenProps) => {
  const character = CHARACTERS[characterId];
  const imgSrc = getImagePathFromId(characterId);
  return (
    <div
      className='relative h-24 w-24 scale-75 rounded-full bg-blue-900 shadow-md hover:cursor-pointer'
      onClick={onClick}
    >
      <img
        className={cn(
          'absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2',
          imgSrc.includes('Fall_of_Rome') && 'scale-75',
        )}
        src={imgSrc}
        loading='lazy'
      />
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
