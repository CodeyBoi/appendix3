import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import Datebox from 'components/gig/datebox';
import GigSignupBox from 'components/gig/signup-box';
import { api } from 'trpc/server';
import { Gig as PrismaGig } from '@prisma/client';
import { IconDotsVertical, IconExternalLink } from '@tabler/icons-react';
import GigMenuContent from './menu-content';
import ActionIcon from 'components/input/action-icon';
import Popover from 'components/popover';
import { lang } from 'utils/language';
import Countdown from 'components/countdown';

dayjs.locale('sv');

type GigId = string;
type Gig = PrismaGig & {
  type: { name: string; nameEn: string };
  hiddenFor: { corpsId: string }[];
  missingInstruments?: Record<string, number>;
};

interface GigCardProps {
  gig: Gig | GigId;
  currentDate?: Date;
}

const isGig = (gig: Gig | GigId): gig is Gig => {
  return typeof gig !== 'string';
};

const PLACE_NAMES = [
  'Malmö',
  'Lomma',
  'Bjärred',
  'Jönköping',
  'Linköping',
  'Uppsala',
  'Hjärup',
  'Vellinge',
  'Limhamn',
];

const SIGNUP_OPTION_YES = {
  label: lang('Ja', 'Yes'),
  value: 'Ja',
  color: 'green',
};
const SIGNUP_OPTION_NO = {
  label: lang('Nej', 'No'),
  value: 'Nej',
  color: 'var(--corps-red)',
};
const SIGNUP_OPTION_MAYBE = {
  label: lang('Kanske', 'Maybe'),
  value: 'Kanske',
  color: 'orange',
};

const constructGoogleMapsUrl = (location: string) => {
  // Add ", Lund" to end of query if no city could be found
  const loc =
    PLACE_NAMES.find((place) => location.includes(' ' + place)) === undefined
      ? `${location}, Lund`
      : location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    loc,
  )}`;
};

const GigCard = async ({
  gig: gigProp,
  currentDate = new Date(),
}: GigCardProps) => {
  const [corps, gig, mainInstrument] = await Promise.all([
    api.corps.getSelf.query(),
    isGig(gigProp)
      ? gigProp
      : await api.gig.getWithId.query({ gigId: gigProp }),
    api.corps.getMainInstrument.query(),
  ]);

  if (!gig) {
    return (
      <div>Error: No gig found with props: {JSON.stringify(gigProp)}.</div>
    );
  }

  const signup = await api.gig.getSignup.query({
    gigId: gig.id,
    corpsId: corps.id,
  });

  const isBeforeSignup = gig.signupStart
    ? currentDate < gig.signupStart
    : false;
  const isAfterSignup = gig.signupEnd ? currentDate > gig.signupEnd : false;
  const gigHasBeen = dayjs(currentDate).isAfter(
    dayjs(gig.date).add(1, 'day').startOf('day'),
  );

  const instruments = corps.instruments.map((i) => ({
    name: i.instrument.name,
    id: i.instrument.id,
  }));

  const allowMaybe = !gig.signupEnd && [2, 3, 4].includes(gig.typeId);

  return (
    <div className='rounded border shadow-md dark:border-neutral-800'>
      <div className='flex flex-col space-y-2 p-4'>
        <div className='flex flex-nowrap items-start justify-between'>
          <Link className='grow' href={`/gig/${gig.id}`}>
            <h4 className='cursor-pointer'>{`${gig.title}${
              gig.countsPositively ? '*' : ''
            }`}</h4>
          </Link>
          <Popover
            position='left-bottom'
            target={
              <ActionIcon variant='subtle'>
                <IconDotsVertical />
              </ActionIcon>
            }
          >
            <GigMenuContent gig={gig} />
          </Popover>
        </div>
        <div className='flex flex-col justify-between lg:flex-row'>
          <div className='grow'>
            <div className='flex grow items-center space-x-4'>
              <Datebox date={dayjs(gig.date)} />
              <div className='text-xs leading-normal'>
                <i>{lang(gig.type.name, gig.type.nameEn)}</i>
                <br />
                {!!gig.location.trim() && (
                  <Link
                    className='flex items-center gap-1'
                    target='_blank'
                    href={constructGoogleMapsUrl(gig.location.trim())}
                  >
                    {gig.location}
                    <IconExternalLink width={12} height={12} />
                  </Link>
                )}
                {gig.price !== 0 && lang('Pris: ', 'Price: ')}
                {gig.price !== 0 && gig.price.toString()}
                {gig.price !== 0 && lang(' kr', ' SEK')}
                {gig.price !== 0 && <br />}
                {!!gig.meetup && lang('Samling: ', 'Gathering: ')}
                {gig.meetup}
                {!!gig.meetup && <br />}
                {!!gig.start && lang('Start: ', 'Start: ')}
                {gig.start}
              </div>
            </div>
          </div>
          <div className='flex w-full flex-col lg:w-56'>
            {!isBeforeSignup && !isAfterSignup && !gigHasBeen && (
              <>
                {gig.signupEnd && (
                  <div className='pr-2 text-right text-xs italic leading-normal'>
                    {lang('Anmälan stänger om ', 'Signup closes in ')}
                    <Countdown end={gig.signupEnd} />
                  </div>
                )}
                <GigSignupBox
                  corpsId={corps.id}
                  gigId={gig.id}
                  instruments={instruments}
                  mainInstrument={mainInstrument}
                  checkbox1={gig.checkbox1}
                  checkbox2={gig.checkbox2}
                  signup={signup ?? undefined}
                  signupOptions={
                    allowMaybe
                      ? [
                          SIGNUP_OPTION_YES,
                          SIGNUP_OPTION_NO,
                          SIGNUP_OPTION_MAYBE,
                        ]
                      : [SIGNUP_OPTION_YES, SIGNUP_OPTION_NO]
                  }
                />
              </>
            )}
            {isBeforeSignup && gig.signupStart && (
              <div className='pr-2 text-right text-xs italic leading-normal'>
                {lang('Anmälan öppnar om ', 'Signup opens in ')}
                <Countdown end={gig.signupStart} />
              </div>
            )}
            {isAfterSignup && gig.signupEnd && !gigHasBeen && (
              <div className='pr-2 text-right text-xs italic leading-normal'>
                {lang('Anmälan har stängt!', 'Signup has closed!')}
              </div>
            )}
          </div>
        </div>
        <div className='whitespace-pre-wrap'>
          {gig.englishDescription
            ? lang(gig.description, gig.englishDescription)
            : gig.description}
        </div>
      </div>
    </div>
  );
};

export default GigCard;
