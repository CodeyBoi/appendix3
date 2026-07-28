import { cn } from 'utils/class-names';
import { CharacterId, CHARACTERS, getWikiLink } from './characters';
import Link from 'next/link';
import { IconAlertCircle } from '@tabler/icons-react';

interface NightOrderEntryProps {
  characterId?: CharacterId;
  name?: string;
  imagePath?: string;
  text: string;
  muted?: boolean;
  topRightText?: string;
  warnings?: string[];
}

const NightOrderEntry = ({
  characterId,
  text,
  muted = false,
  topRightText,
  warnings = [],
  ...props
}: NightOrderEntryProps) => {
  const character = characterId ? CHARACTERS[characterId] : undefined;
  const characterName = character?.name ?? props.name;

  if (!characterName || !text) {
    return null;
  }

  const imgPath = character?.image ? character.image[0] : props.imagePath;

  const nameElement = (
    <>
      {characterName}{' '}
      {props.name && characterId && (
        <span className='text-xs font-light text-neutral-500'>
          ({props.name})
        </span>
      )}
    </>
  );

  const imgElement = imgPath ? (
    <img
      className={cn(
        'relative z-0 h-12 w-12 scale-150',
        imgPath.includes('Fall_of_Rome') && 'translate-y-1.5',
      )}
      loading='lazy'
      src={imgPath}
    />
  ) : null;

  return (
    <div className={cn('flex flex-col gap-2 px-2 py-1', muted && 'opacity-50')}>
      <div className='flex items-center gap-4'>
        {imgElement && (
          <>
            {characterId ? (
              <Link href={getWikiLink(characterId)} target='_blank'>
                {imgElement}
              </Link>
            ) : (
              imgElement
            )}
          </>
        )}
        <div
          className={cn(
            'flex grow flex-col',
            imgPath && warnings.length === 0 && 'mt-3',
          )}
        >
          {topRightText && (
            <div className='whitespace-nowrap text-xs font-thin opacity-50 lg:hidden'>
              {topRightText}
            </div>
          )}
          <h4 className='hidden lg:block'>{nameElement}</h4>
          <h5 className='lg:hidden'>{nameElement}</h5>
          <div className='flex flex-col gap-2'>
            {warnings.map((msg) => (
              <div
                key={msg}
                className='flex items-center gap-1 text-xs font-thin text-red-600'
              >
                <IconAlertCircle size={16} />
                {msg}
              </div>
            ))}
          </div>
        </div>
        {topRightText && (
          <div className='hidden translate-y-px whitespace-nowrap text-sm font-thin opacity-50 lg:block'>
            {topRightText}
          </div>
        )}
      </div>
      <span className='text-sm'>{text}</span>
    </div>
  );
};

export default NightOrderEntry;
