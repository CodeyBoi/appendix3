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
  const name = characterId ? CHARACTERS[characterId].name : props.name;

  if (!name || !text) {
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
          <img className='h-12 w-12 scale-150' loading='lazy' src={imgPath} />
        )}
        <h4 className={cn(imgPath && 'mt-3')}>{name}</h4>
      </div>
      <span className='text-sm'>{text}</span>
    </div>
  );
};

export default NightOrderEntry;
