import { IconMail } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Loading from 'components/loading';
import Modal from 'components/modal';
import { assert } from 'console';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from 'trpc/react';
import { filterNone } from 'utils/array';
import { numberAndFullName } from 'utils/corps';
import { lang } from 'utils/language';

interface Corps {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  pronouns: string | null;
  number: number | null;
  bNumber: number | null;
  contactUrl: string | null;
  points: number;
  firstGigDate: Date | undefined;
  firstRehearsalDate: Date | undefined;
}

interface CorpsInfoboxProps {
  corps: Corps;
}

// A list of "instruments" which should have the prefix "är"
const beingPrefixes = ['dirigent', 'balett', 'slagverksfröken'];


const PositionInfobox = ({ corps }: CorpsInfoboxProps) => {
  const corpsNameTemp = numberAndFullName(corps);
  const corpsName =
    corpsNameTemp.length > 25
      ? corpsNameTemp.slice(0, 25) + corpsNameTemp.slice(25).replace(' ', '\n')
      : corpsNameTemp;

  const {
    nickName,
    pronouns,
    number,
    contactUrl,
    points,
    firstGigDate,
    firstRehearsalDate,
  } = corps;

  const joinedAt =
    (firstGigDate?.getTime() ?? Number.MAX_VALUE) <
      (firstRehearsalDate?.getTime() ?? Number.MAX_VALUE)
      ? firstGigDate
      : firstRehearsalDate;

  const joinedMsg = `Gick med i corpset den ${joinedAt?.getDate()} ${joinedAt?.toLocaleDateString(
    'sv',
    { month: 'long' },
  )} ${joinedAt?.getFullYear()}.`;

  const newcontact = contactUrl ? contactUrl : "blubblub"


  return (
    <div className='flex w-min flex-col p-2 text-left text-sm'>
      <div className='text-lg font-bold'>
        <div className='flex flex-nowrap items-start gap-2 whitespace-pre'>
          {corpsName}

          {
            <ActionIcon
              href={newcontact}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          }
        </div>
        {(nickName || pronouns) && (
          <div className='mb-1 bg-transparent text-xs font-light text-neutral-500'>
            {filterNone([corps.nickName, corps.pronouns]).join(' • ')}
          </div>
        )}
      </div>

      <div className='h-1.5' />

    </div>
  );
};

export default PositionInfobox;
