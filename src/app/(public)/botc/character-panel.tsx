import Link from 'next/link';
import { cn } from 'utils/class-names';
import { Alignment, CharacterId, CHARACTERS } from './characters';

interface BotcCharacterPanelProps {
  name: string;
  imgSrc: string;
  imgLink?: string;
  description: string;
  showDescription: boolean;
  alignment: Alignment;
  jinxes?: CharacterId[];
}

const BotcCharacterPanel = ({
  name,
  imgSrc,
  imgLink,
  description,
  showDescription,
  alignment,
  jinxes = [],
}: BotcCharacterPanelProps) => {
  const imgElement = (
    <img
      className={cn(
        'w-8 scale-150 lg:h-12 lg:w-12',
        imgSrc.includes('Fall_of_Rome') && 'translate-y-1.5',
      )}
      loading='lazy'
      src={imgSrc}
    />
  );
  const nameColor = alignment === 'good' ? 'text-blue-700' : 'text-red-800';
  return (
    <div className='flex gap-2'>
      <div className='absolute flex self-center'>
        {imgLink ? (
          <Link target='_blank' href={imgLink}>
            {imgElement}
          </Link>
        ) : (
          imgElement
        )}
      </div>
      <div className='ml-10 flex flex-col lg:ml-14'>
        <div className='flex items-center'>
          <h5 className={cn('hidden lg:block', nameColor)}>{name}</h5>
          <h6 className={cn('lg:hidden', nameColor)}>{name}</h6>
          {jinxes.length > 0 && <div className='w-1' />}
          {jinxes.map((jinx) => (
            <img
              className='h-6 w-6'
              src={CHARACTERS[jinx].image?.[0]}
              loading='lazy'
            />
          ))}
        </div>
        {showDescription && <p className='text-xs lg:text-sm'>{description}</p>}
      </div>
    </div>
  );
};

export default BotcCharacterPanel;
