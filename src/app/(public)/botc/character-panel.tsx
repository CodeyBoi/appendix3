import Link from 'next/link';
import { cn } from 'utils/class-names';

interface BotcCharacterPanelProps {
  name: string;
  imgSrc: string;
  imgLink?: string;
  description: string;
  showDescription: boolean;
}

const BotcCharacterPanel = ({
  name,
  imgSrc,
  imgLink,
  description,
  showDescription,
}: BotcCharacterPanelProps) => {
  const imgElement = (
    <img
      className={cn(
        'h-8 w-8 scale-150 lg:h-12 lg:w-12',
        imgSrc.includes('Fall_of_Rome') && 'translate-y-1.5',
      )}
      loading='lazy'
      src={imgSrc}
    />
  );
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-4'>
        {imgLink ? (
          <Link target='_blank' href={imgLink}>
            {imgElement}
          </Link>
        ) : (
          imgElement
        )}
        <h5 className='hidden lg:block'>{name}</h5>
        <h6 className='lg:hidden'>{name}</h6>
      </div>
      {showDescription && <p className='text-xs lg:text-sm'>{description}</p>}
    </div>
  );
};

export default BotcCharacterPanel;
