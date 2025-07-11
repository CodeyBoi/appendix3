'use client';

import { IconPencil } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Loading from 'components/loading';
import Modal from 'components/modal';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from 'trpc/react';
import { filterNone } from 'utils/array';
import { numberAndFullName } from 'utils/corps';
import { lang } from 'utils/language';

interface CorpsInfoboxProps {
  id: string;
  open: boolean;
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

const CorpsInfobox = ({ id, open }: CorpsInfoboxProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: corps } = api.corps.get.useQuery({ id }, { enabled: open });
  const { data: self } = api.corps.getSelf.useQuery(undefined, {
    enabled: open,
  });
  const { data: allTimeStreak } = api.stats.getAllTimeStreak.useQuery(
    { corpsId: id },
    { enabled: open },
  );

  const [showAllStreaks, setShowAllStreaks] = useState(false);
  const [newNickName, setNewNickName] = useState('');

  const mutation = api.corps.changeNickname.useMutation({
    onSuccess: async () => {
      await utils.corps.get.invalidate({ id });
      router.refresh();
    },
  });

  if (!corps || !self || !allTimeStreak) {
    return (
      <Loading
        msg={
          <span className='whitespace-nowrap'>
            {lang('Hämtar corps...', 'Fetching corps...')}
          </span>
        }
      />
    );
  }

  const {
    instruments,
    nickName,
    pronouns,
    number,
    points,
    firstGigDate,
    firstRehearsalDate,
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

  const corpsNameTemp = numberAndFullName(corps);
  const corpsName =
    corpsNameTemp.length > 25
      ? corpsNameTemp.slice(0, 25) + corpsNameTemp.slice(25).replace(' ', '\n')
      : corpsNameTemp;

  const handleNicknameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      corpsId: id,
      nickname: newNickName,
    });
  };

  return (
    <div className='flex w-min flex-col p-2 text-left text-sm'>
      <div className='text-lg font-bold'>
        <div className='flex flex-nowrap items-start gap-2 whitespace-pre'>
          {corpsName}
          {!!number && self.id !== id && (
            <Modal
              title='Byt smeknamn'
              withCloseButton
              target={
                <ActionIcon variant='subtle'>
                  <IconPencil />
                </ActionIcon>
              }
            >
              <form
                className='flex flex-col gap-2'
                onSubmit={handleNicknameSubmit}
              >
                <div className='flex w-full gap-2'>
                  <input
                    placeholder='Nytt smeknamn'
                    value={newNickName}
                    onChange={(e) => {
                      setNewNickName(e.target.value);
                    }}
                    name='nickname'
                    type='text'
                    className='grow rounded border border-gray-300 bg-white p-2 dark:border-gray-700'
                  />
                  <button
                    type='submit'
                    className='rounded bg-red-600 p-2 text-white hover:bg-red-700'
                  >
                    {lang('Spara', 'Submit')}
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </div>
        {(nickName || pronouns) && (
          <div className='mb-1 bg-transparent text-xs font-light text-neutral-500'>
            {filterNone([nickName, pronouns]).join(' • ')}
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
        {lang(
          'Deras längsta spelningsstreak är ',
          'Their longest gig streak is ',
        )}{' '}
        <span
          onClick={() => {
            setShowAllStreaks(!showAllStreaks);
          }}
        >
          {`${allTimeStreak.maxStreak}🔥`}
        </span>
        {showAllStreaks ? ' (' + allTimeStreak.streaks.join(', ') + ')' : ''}.
      </div>
    </div>
  );
};

export default CorpsInfobox;
