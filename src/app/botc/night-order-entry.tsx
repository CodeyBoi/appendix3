import { cn } from 'utils/class-names';
import {
  CharacterID,
  CHARACTERS,
  EditionID,
  getAlignment,
  getEdition,
} from './characters';

interface NightOrderEntryProps {
  characterId?: CharacterID;
  name?: string;
  imagePath?: string;
  text: string;
}

const ABBREVIATIONS: Record<EditionID, string> = {
  'trouble-brewing': 'tb',
  'bad-moon-rising': 'bmr',
  'sects-and-violets': 'snv',
  custom: 'carousel',
};
const baseImgUrl = `https://script.bloodontheclocktower.com/src/assets/icons/<EDITION>/<NAME>_<ALIGNMENT>.webp`;
const getImagePathFromId = (id: CharacterID) =>
  baseImgUrl
    .replace('<EDITION>', ABBREVIATIONS[getEdition(id)])
    .replace('<NAME>', id)
    .replace('<ALIGNMENT>', getAlignment(id).slice(0, 1));

const NightOrderEntry = ({
  characterId,
  text,
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
    <div className='flex flex-col gap-2 border-t px-2 py-1'>
      <div className='flex gap-4'>
        {imgPath && <img className='h-12 w-12 scale-150' src={imgPath} />}
        <h4 className={cn(imgPath && 'mt-3')}>{name}</h4>
      </div>
      <span className='text-sm'>{text}</span>
    </div>
  );
};

export default NightOrderEntry;
