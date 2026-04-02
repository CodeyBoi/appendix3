import { cn } from 'utils/class-names';
import { CharacterId, CHARACTERS, getImagePathFromId } from './characters';

interface NightOrderEntryProps {
  characterId?: CharacterId;
  name?: string;
  imagePath?: string;
  text: string;
  muted?: boolean;
}

const NightOrderEntry = ({
  characterId,
  text,
  muted = false,
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
    <div
      className={cn(
        'flex flex-col gap-2 border-b px-2 py-1',
        muted && 'opacity-50',
      )}
    >
      <div className='flex gap-4'>
        {imgPath && (
          <img
            className={cn(
              'h-12 w-12 scale-150',
              imgPath.includes('Fall_of_Rome') && 'translate-y-1.5',
            )}
            loading='lazy'
            src={imgPath}
          />
        )}
        <div className={cn(imgPath && 'mt-3')}>
          <h4>
            {characterName}{' '}
            {props.name && characterId && (
              <span className='text-xs text-neutral-500'>({props.name})</span>
            )}
          </h4>
        </div>
      </div>
      <span className='text-sm'>{text}</span>
    </div>
  );
};

export default NightOrderEntry;
