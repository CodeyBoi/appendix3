import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import Datebox from 'components/gig/datebox';
import GigSignupBox from 'components/gig/signup-box';
import { api } from 'trpc/server';
import { Gig as PrismaGig } from '@prisma/client';
import { IconDotsVertical } from '@tabler/icons-react';
import GigMenuContent from './menu-content';
import ActionIcon from 'components/input/action-icon';
import Popover from 'components/popover';
import { lang } from 'utils/language';
import Time from 'components/time';
import Countdown from 'components/countdown';

dayjs.locale('sv');

type GigId = string;
type Gig = PrismaGig & {
  type: { name: string };
  hiddenFor: { corpsId: string }[];
};

interface GigCardProps {
  gig: Gig | GigId;
}

const isGig = (gig: Gig | GigId): gig is Gig => {
  return (gig as Gig).id !== undefined;
};

const GigCard = async ({ gig: gigProp }: GigCardProps) => {
  const [corps, gig] = await Promise.all([
    api.corps.getSelf.query(),
    isGig(gigProp)
      ? gigProp
      : await api.gig.getWithId.query({ gigId: gigProp }),
  ]);

  if (!corps) {
    return <div>Error: No corps found.</div>;
  }

  if (!gig) {
    return <div>Error: No gig found with props: {`${{ gig: gigProp }}`}.</div>;
  }

  const signup = await api.gig.getSignup.query({
    gigId: gig.id,
    corpsId: corps.id,
  });

  const date = new Date();
  const isBeforeSignup = gig.signupStart ? date < gig.signupStart : false;
  const isAfterSignup = gig.signupEnd ? date > gig.signupEnd : false;

  return (
    <div className='rounded border shadow-md dark:border-neutral-800'>
      <div className='flex flex-col space-y-2 p-4'>
        <div className='flex flex-nowrap items-start justify-between'>
          <Link className='grow' href={`/gig/${gig.id}`}>
            <h4 className='cursor-pointer'>{gig.title}</h4>
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
          <Link className='grow' href={`/gig/${gig.id}`}>
            <div className='flex grow cursor-pointer items-center space-x-4'>
              <Datebox date={dayjs(gig.date)} />
              <div className='text-xs leading-normal'>
                <i>{gig.type.name}</i>
                <br />
                {!!gig.location && `${gig.location}`}
                {!!gig.location && <br />}
                {gig.price !== 0 && lang('Pris: ', 'Price: ')}
                {gig.price !== 0 && gig.price.toString()}
                {gig.price !== 0 && lang(' kr', ' crowns')}
                {gig.price !== 0 && <br />}
                {!!gig.meetup && lang('Samling: ', 'Gathering: ')}
                {gig.meetup}
                {!!gig.meetup && <br />}
                {!!gig.start && lang('Start: ', 'Start: ')}
                {gig.start}
              </div>
            </div>
          </Link>
          <div className='flex w-full flex-col lg:w-56'>
            {!isBeforeSignup && !isAfterSignup && (
              <>
                {gig.signupEnd && (
                  <div className='pr-2 text-right text-xs italic leading-normal'>
                    {lang('Anmälan stänger', 'Signup closes')}{' '}
                    {gig.signupEnd.getTime() + 1000 * 60 * 60 * 24 >
                    Date.now() ? (
                      <>
                        {lang('om ', 'in ')}
                        <br />
                        <Countdown end={gig.signupEnd} />
                      </>
                    ) : (
                      <Time
                        date={gig.signupEnd}
                        options={{
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        }}
                      />
                    )}
                  </div>
                )}
                <GigSignupBox
                  gigId={gig.id}
                  checkbox1={gig.checkbox1}
                  checkbox2={gig.checkbox2}
                  signup={signup ?? undefined}
                />
              </>
            )}
            {isBeforeSignup && gig.signupStart && (
              <div className='pr-2 text-right text-xs italic leading-normal'>
                {lang('Anmälan öppnar', 'Signup opens')}{' '}
                <Time
                  date={gig.signupStart}
                  options={{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          {gig.englishDescription
            ? lang(gig.description, gig.englishDescription)
            : gig.description}
        </div>
      </div>
    </div>
  );
};

export default GigCard;
