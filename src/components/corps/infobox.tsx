'use client';

import Loading from 'components/loading';
import { api } from 'trpc/react';

type CorpsInfoboxProps = {
  id: string;
};

const genOtherInstrumentsString = (instruments: string[]) => {
  instruments = instruments.map((i) => i.toLowerCase());
  if (instruments.length === 0) return '';
  if (instruments.length === 1) return instruments[0];
  return (
    instruments.slice(0, instruments.length - 1).join(', ') +
    ' och ' +
    instruments[instruments.length - 1]
  );
};

// A list of "instruments" which should have the prefix "är"
const beingPrefixes = ['dirigent', 'balett'];

const CorpsInfobox = ({ id }: CorpsInfoboxProps) => {
  const { data: corps } = api.corps.get.useQuery({ id });
  if (!corps) {
    return <Loading msg='Hämtar corps...' />;
  }
  const { instruments, fullName, nickName, number, points } = corps;
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
    <div className='flex w-min flex-col p-2 text-sm'>
      <div className='whitespace-nowrap text-lg font-bold'>
        {`${number ? `#${number}` : 'p.e.'} ${fullName} `}
        {nickName && (
          <span className='bg-transparent text-xs font-light text-neutral-500'>
            {'a.k.a. ' + nickName}
          </span>
        )}
      </div>

      <div className='italic'>{'Spelpoäng: ' + points}</div>
      <div className='h-1.5' />
      <div>{instrumentsMsg}</div>
    </div>
  );
};

export default CorpsInfobox;
