import { cn } from 'utils/class-names';
import { CharacterId, CHARACTERS, getDefaultAlignment } from './characters';

interface BotcCharacterPanelProps {
  first: CharacterId;
  second: CharacterId;
  description: string;
}

const Jinx = ({ first, second, description }: BotcCharacterPanelProps) => {
  const firstCharacter = CHARACTERS[first];
  const secondCharacter = CHARACTERS[second];

  const firstNameColor =
    getDefaultAlignment(first) === 'good' ? 'text-blue-700' : 'text-red-800';
  const secondNameColor =
    getDefaultAlignment(second) === 'good' ? 'text-blue-700' : 'text-red-800';

  const nameElement = (
    <>
      <span className={firstNameColor}>{firstCharacter.name}</span> &{' '}
      <span className={secondNameColor}>{secondCharacter.name}</span>
    </>
  );

  return (
    <div className='flex gap-2'>
      <div className='absolute flex self-center'>
        <div className='relative h-10 w-10'>
          <img
            className={cn(
              'absolute left-0 top-0 h-6 w-6 scale-150',
              firstCharacter.image?.[0].includes('Fall_of_Rome') &&
                'translate-y-1.5',
            )}
            loading='lazy'
            src={firstCharacter.image?.[0]}
          />
          <img
            className={cn(
              'absolute left-4 top-4 h-6 w-6 scale-150',
              secondCharacter.image?.[0].includes('Fall_of_Rome') &&
                'translate-y-1.5',
            )}
            loading='lazy'
            src={secondCharacter.image?.[0]}
          />
        </div>
      </div>
      <div className='ml-12 flex flex-col lg:ml-12'>
        <h5 className='hidden lg:block'>{nameElement}</h5>
        <h6 className='lg:hidden'>{nameElement}</h6>
        <p className='text-xs lg:text-sm'>{description}</p>
      </div>
    </div>
  );
};

export default Jinx;
