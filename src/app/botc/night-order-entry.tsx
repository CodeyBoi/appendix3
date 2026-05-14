import { cn } from 'utils/class-names';
import { CharacterId, CHARACTERS, getImagePathFromId } from './characters';

interface NightOrderEntryProps {
  characterId?: CharacterId;
  name?: string;
  imagePath?: string;
  text: string;
  muted?: boolean;
  topRightText?: string;
}

const NightOrderEntry = ({
  characterId,
  text,
  muted = false,
  topRightText,
  ...props
}: NightOrderEntryProps) => {
  const characterName = characterId ? CHARACTERS[characterId].name : props.name;

  if (!characterName || !text) {
    return null;
  }

  const imgPath = characterId
    ? getImagePathFromId(characterId)
    : props.imagePath;

  return (
    <div className={cn('flex flex-col gap-2 px-2 py-1', muted && 'opacity-50')}>
      <div className='flex items-center gap-4'>
        {imgPath && (
          <img
            className={cn(
              'relative z-0 h-12 w-12 scale-150',
              imgPath.includes('Fall_of_Rome') && 'translate-y-1.5',
            )}
            loading='lazy'
            src={imgPath}
          />
        )}
        <div className={cn('grow', imgPath && 'mt-3')}>
          <h4>
            {characterName}{' '}
            {props.name && characterId && (
              <span className='text-xs font-light text-neutral-500'>
                ({props.name})
              </span>
            )}
          </h4>
        </div>
        {topRightText && (
          <div className='translate-y-px whitespace-nowrap text-xs font-thin lg:text-sm'>
            {topRightText}
          </div>
        )}
      </div>
      <span className='text-sm'>{text}</span>
    </div>
  );
};

export default NightOrderEntry;
