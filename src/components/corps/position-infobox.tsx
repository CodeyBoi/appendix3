import { IconMail } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { filterNone } from 'utils/array';
import { numberAndFullName } from 'utils/corps';
import { lang } from 'utils/language';

interface Instrument {
  instrument: { name: string };
  isMainInstrument: boolean;
}

interface Corps {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  pronouns: string | null;
  number: number | null;
  bNumber: number | null;
  contactURL: string | null;
  points: number;
  firstGigDate: Date | undefined;
  firstRehearsalDate: Date | undefined;
  instruments: Instrument[];
}

interface CorpsInfoboxProps {
  corps: Corps;
}

const genOtherInstrumentsString = (instruments: string[]) => {
  const instrumentsLower = instruments.map((i) => i.toLowerCase());
  if (instrumentsLower.length === 0) return '';
  if (instrumentsLower.length === 1) return instrumentsLower[0] ?? '';
  return `${instrumentsLower
    .slice(0, instrumentsLower.length - 1)
    .join(', ')} och ${instrumentsLower[instrumentsLower.length - 1] ?? ''}`;
};

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
    contactURL,
    points,
    firstGigDate,
    firstRehearsalDate,
    instruments
  } = corps;

  const mainInstrument =
    instruments.find((i) => i.isMainInstrument)?.instrument.name ?? '';
  const otherInstruments = instruments
    .filter((i) => !i.isMainInstrument)
    .map((i) => i.instrument.name);

  const isPlayingMainInstrument = !beingPrefixes.includes(
    mainInstrument.toLowerCase(),
  );
  const isPlayingOtherInstrument = !otherInstruments.some((i) =>
    beingPrefixes.includes(i.toLowerCase()),
  );


  const joinedAt =
    (firstGigDate?.getTime() ?? Number.MAX_VALUE) <
      (firstRehearsalDate?.getTime() ?? Number.MAX_VALUE)
      ? firstGigDate
      : firstRehearsalDate;

  const joinedMsg = `Gick med i corpset den ${joinedAt?.getDate()} ${joinedAt?.toLocaleDateString(
    'sv',
    { month: 'long' },
  )} ${joinedAt?.getFullYear()}.`;

  const temp1 = isPlayingMainInstrument ? 'Spelar ' : 'Är ';

  // If the main instrument is the same as the other instruments, we don't need to specify it twice
  const temp2 =
    isPlayingMainInstrument !== isPlayingOtherInstrument
      ? isPlayingOtherInstrument
        ? 'spelar '
        : 'är '
      : '';

  const instrumentsMsg =
    temp1 +
    (otherInstruments.length > 0 ? 'främst ' : '') +
    mainInstrument.toLowerCase() +
    (otherInstruments.length > 0
      ? ', men ' + temp2 + 'även ' + genOtherInstrumentsString(otherInstruments)
      : '') +
    '.';

  return (
    <div>
      <div className='text-lg font-bold'>
        <div className='flex flex-nowrap items-start gap-2 whitespace-pre'>
          {corpsName}

          {(contactURL) && (
            <ActionIcon
              href={contactURL}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          )}
        </div>
        {(nickName || pronouns) && (
          <div className='mb-1 bg-transparent text-xs font-light text-neutral-500'>
            {filterNone([corps.nickName, corps.pronouns]).join(' • ')}
          </div>
        )}
      </div>
      <div className='italic'>
        {lang('Spelpoäng: ', 'Gig points: ')}
        {points}
      </div>
      <div className='h-1.5' />
      <div className='text-sm font-light'>
        {joinedAt && joinedMsg} {instrumentsMsg}{' '}

      </div>

    </div>
  );
};

export default PositionInfobox;
