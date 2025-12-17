import { CharacterID, CHARACTERS, NIGHT_ORDER_TEXT } from './characters';

interface NightOrderEntryProps {
  characterId: CharacterID;
  isFirstNight?: boolean;
  firstNight?: string;
  otherNights?: string;
}

const NightOrderEntry = ({
  characterId,
  isFirstNight = false,
  ...props
}: NightOrderEntryProps) => {
  const nightOrderText = NIGHT_ORDER_TEXT[characterId];
  const firstNight = props.firstNight ?? nightOrderText?.firstNight;
  const otherNights = props.otherNights ?? nightOrderText?.otherNights;
  const character = CHARACTERS[characterId];

  if ((isFirstNight && !firstNight) || (!isFirstNight && !otherNights)) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2 border-t'>
      <div className='flex gap-4'>
        <div className='h-12 w-12 bg-red-600' />
        <h4>{character.name}</h4>
      </div>
      <span className='text-sm'>{isFirstNight ? firstNight : otherNights}</span>
    </div>
  );
};

export default NightOrderEntry;
