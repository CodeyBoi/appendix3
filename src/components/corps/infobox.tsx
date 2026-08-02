'use client';

import { IconPencil } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Button from 'components/input/button';
import Loading from 'components/loading';
import Modal from 'components/modal';
import useLanguage, { Language } from 'hooks/use-language';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from 'trpc/react';
import { filterNone } from 'utils/array';
import { numberAndFullName } from 'utils/corps';
import { calcOperatingYearInterval, getOperatingYear } from 'utils/date';
import { lang } from 'utils/language';

interface CorpsInfoboxProps {
  id: string;
  open: boolean;
  operatingYear?: number;
  queryActive?: boolean;
}

const DEFAULT_COURAGE_MESSAGE = {
  lowerLimit: 0.0,
  message: 'skräckslagen',
  messageEn: 'terrified',
};
const COURAGE_MESSAGES: {
  lowerLimit: number;
  message: string;
  messageEn: string;
}[] = [
  {
    lowerLimit: 2.4,
    message: 'fullkomligt galen',
    messageEn: 'completely nuts',
  },
  { lowerLimit: 2.05, message: 'tokig', messageEn: 'nuts' },
  {
    lowerLimit: 1.98,
    message: 'smått tokig',
    messageEn: 'slightly reckless',
  },
  { lowerLimit: 1.87, message: 'dumdristig', messageEn: 'fearless' },
  { lowerLimit: 1.75, message: 'våghalsig', messageEn: 'daring' },
  { lowerLimit: 1.65, message: 'orädd', messageEn: 'bold' },
  { lowerLimit: 1.55, message: 'djärv', messageEn: 'courageous' },
  { lowerLimit: 1.45, message: 'modig', messageEn: 'brave' },
  { lowerLimit: 1.38, message: 'väldigt lagom', messageEn: 'very ordinary' },
  { lowerLimit: 1.3, message: 'självsäker', messageEn: 'confident' },
  { lowerLimit: 1.2, message: 'eftertänksam', messageEn: 'cautious' },
  { lowerLimit: 1.1, message: 'välförberedd', messageEn: 'well prepared' },
  { lowerLimit: 1.0, message: 'försiktig', messageEn: 'careful' },
  { lowerLimit: 0.87, message: 'smått blygsam', messageEn: 'slightly timid' },
  { lowerLimit: 0.67, message: 'blygsam', messageEn: 'timid' },
];

const getCourageMessage = (courage: number) =>
  COURAGE_MESSAGES.find(({ lowerLimit }) => lowerLimit <= courage) ??
  DEFAULT_COURAGE_MESSAGE;

const genOtherInstrumentsString = (
  instruments: string[],
  language: Language = 'sv',
) => {
  const instrumentsLower = instruments.map((i) => i.toLowerCase());
  if (instrumentsLower.length === 0) return '';
  if (instrumentsLower.length === 1) return instrumentsLower[0] ?? '';
  return `${instrumentsLower
    .slice(0, instrumentsLower.length - 1)
    .join(', ')} ${language === 'sv' ? 'och' : 'and'} ${
    instrumentsLower[instrumentsLower.length - 1] ?? ''
  }`;
};

// A list of "instruments" which should have the prefix "är"
const BEING_PREFIXES = ['dirigent', 'balett', 'slagverksfröken'];

const DATE_FORMATTERS: Record<Language, Intl.DateTimeFormat> = {
  sv: new Intl.DateTimeFormat('sv', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  en: new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
};

const CorpsInfobox = ({
  id,
  open,
  operatingYear = getOperatingYear(),
  queryActive = false,
}: CorpsInfoboxProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { language } = useLanguage();
  const { data: corps } = api.corps.get.useQuery(
    { id },
    { enabled: queryActive || open },
  );
  const { data: ownId } = api.corps.getSelfId.useQuery(undefined, {
    enabled: queryActive || open,
  });
  const { data: allTimeStreak } = api.stats.getAllTimeStreak.useQuery(
    { corpsId: id },
    { enabled: queryActive || open },
  );

  const { start, end } = calcOperatingYearInterval(operatingYear);
  const { data: summary } = api.stats.getSummary.useQuery(
    { corpsId: id, start, end },
    { enabled: queryActive || open },
  );

  const [showAllStreaks, setShowAllStreaks] = useState(false);
  const [newNickName, setNewNickName] = useState('');
  const [nickNameModalOpen, setNickNameModalOpen] = useState(false);

  const dateFormatter = DATE_FORMATTERS[language];

  const mutation = api.corps.changeNickname.useMutation({
    onSuccess: async () => {
      await utils.corps.get.invalidate({ id });
      router.refresh();
    },
  });

  if (!corps || !ownId || !allTimeStreak || !summary) {
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
    lastSeenAt,
  } = corps;
  const mainInstrument =
    instruments.find((i) => i.isMainInstrument)?.instrument.name ?? '';
  const otherInstruments = instruments
    .filter((i) => !i.isMainInstrument)
    .map((i) => i.instrument.name);

  const isPlayingMainInstrument = !BEING_PREFIXES.includes(
    mainInstrument.toLowerCase(),
  );
  const isPlayingOtherInstrument = !otherInstruments.some((i) =>
    BEING_PREFIXES.includes(i.toLowerCase()),
  );

  const joinedAt =
    (firstGigDate?.getTime() ?? Number.MAX_VALUE) <
    (firstRehearsalDate?.getTime() ?? Number.MAX_VALUE)
      ? firstGigDate
      : firstRehearsalDate;

  const joinedMsg = joinedAt
    ? language === 'sv'
      ? `Gick med i corpset den ${dateFormatter.format(joinedAt)}.`
      : `Joined Bleckhornen ${dateFormatter.format(joinedAt)}.`
    : undefined;

  const temp1 = isPlayingMainInstrument
    ? language === 'sv'
      ? 'Spelar '
      : 'Plays '
    : language === 'sv'
    ? 'Är '
    : 'Is ';

  // If the main instrument is the same as the other instruments, we don't need to specify it twice
  const temp2 =
    isPlayingMainInstrument !== isPlayingOtherInstrument
      ? isPlayingOtherInstrument
        ? language === 'sv'
          ? 'spelar '
          : 'plays '
        : language === 'sv'
        ? 'är '
        : 'is '
      : '';

  const instrumentsMsg =
    temp1 +
    (otherInstruments.length > 0
      ? language === 'sv'
        ? 'främst '
        : 'mainly '
      : '') +
    mainInstrument.toLowerCase() +
    (otherInstruments.length > 0
      ? (language === 'sv' ? ', men ' : ', but ') +
        (language === 'en' && temp2.includes('plays') ? 'also ' : '') +
        temp2 +
        (language === 'sv'
          ? 'även '
          : !temp2.includes('plays')
          ? 'also '
          : '') +
        genOtherInstrumentsString(otherInstruments)
      : '') +
    '.';

  const corpsNameTemp = numberAndFullName(corps);
  const corpsName =
    corpsNameTemp.length > 25
      ? corpsNameTemp.slice(0, 25) + corpsNameTemp.slice(25).replace(' ', '\n')
      : corpsNameTemp;

  const courageMessage =
    language === 'sv'
      ? `Kan anses ${getCourageMessage(summary.courageQuotient).message}.`
      : `Can be considered ${
          getCourageMessage(summary.courageQuotient).messageEn
        }.`;

  const lastSeenAtMsg = lastSeenAt
    ? language === 'sv'
      ? `Sågs senast den ${dateFormatter.format(lastSeenAt)}.`
      : `Last seen ${dateFormatter.format(lastSeenAt)}.`
    : undefined;

  const changeNicknameMsg =
    language === 'sv'
      ? 'Detta smeknamnet kommer att visas för alla på Blindtarmen och det kommer synas att det är du som ändrat det.\n\nLovar du att det är rimligt och inte kränkande?'
      : 'This nickname will be displayed to everyone at Blindtarmen and it will be shown that you are the one that changed it.\n\nDo you promise that it is reasonable and not offensive?';
  const handleNicknameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm(changeNicknameMsg)) {
      return false;
    }
    setNickNameModalOpen(false);
    mutation.mutate({
      corpsId: id,
      nickname: newNickName.trim(),
    });
    setNewNickName(newNickName.trim());
  };

  return (
    <div className='flex w-min flex-col p-2 text-left text-sm'>
      <div className='text-lg font-bold'>
        <div className='flex flex-nowrap items-start gap-2 whitespace-pre'>
          {corpsName}
          {!!number && ownId !== id && (
            <Modal
              title={lang(`Byt smeknamn`, 'Change nickname')}
              withCloseButton
              target={
                <ActionIcon variant='subtle'>
                  <IconPencil />
                </ActionIcon>
              }
              onFocus={() => {
                setNickNameModalOpen(true);
                setNewNickName(corps.nickName ?? '');
              }}
              onBlur={() => {
                setNickNameModalOpen(false);
              }}
              open={nickNameModalOpen}
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
                  <Button
                    type='submit'
                    disabled={
                      mutation.isLoading || newNickName === corps.nickName
                    }
                    className='rounded bg-red-600 p-2 text-white hover:bg-red-700'
                  >
                    {mutation.isLoading
                      ? lang('Sparar...', 'Submitting...')
                      : lang('Spara', 'Submit')}
                  </Button>
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
        {joinedAt && joinedMsg} {instrumentsMsg}
        {summary.gigsAttended.total >= 3 && summary.rehearsalsAttended >= 3 && (
          <> {courageMessage}</>
        )}
        {allTimeStreak.maxStreak >= 3 && (
          <>
            {' '}
            {lang(
              'Hens längsta spelningsstreak är ',
              'Their longest gig streak is ',
            )}
            <span
              onClick={() => {
                setShowAllStreaks(!showAllStreaks);
              }}
            >
              {`${allTimeStreak.maxStreak}🔥`}
            </span>
            {showAllStreaks
              ? ' (' + allTimeStreak.streaks.join(', ') + ')'
              : ''}
            .
          </>
        )}
        {lastSeenAtMsg && (
          <>
            <div className='h-2' />
            <span className='text-xs text-neutral-500'>{lastSeenAtMsg}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CorpsInfobox;
