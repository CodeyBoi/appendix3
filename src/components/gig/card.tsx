import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import Datebox from 'components/gig/datebox';
import GigMenu from 'components/gig/menu';
import GigSignupBox from 'components/gig/signup-box';
import { api } from 'trpc/server';
import { Gig as PrismaGig } from '@prisma/client';
import { IconDotsVertical } from '@tabler/icons';
import GigMenuContent from './menu/content';

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
  const corps = await api.corps.getSelf.query();
  const isAdmin = corps?.role?.name === 'admin';

  const gig = isGig(gigProp)
    ? gigProp
    : await api.gig.getWithId.query({ gigId: gigProp });

  if (!gig) {
    return <div>Error: No gig found with props: {`${{ gig: gigProp }}`}.</div>;
  }

  const currentDate = dayjs().startOf('day');
  const showSignup =
    // Today is before the gig date
    currentDate.subtract(1, 'day').isBefore(gig.date, 'day') &&
    // There is no signup start date or today is after or at the signup start date
    (!gig.signupStart ||
      currentDate.add(1, 'day').isAfter(gig.signupStart, 'day')) &&
    // There is no signup end date or today is before or at the signup end date
    (!gig.signupEnd ||
      currentDate.subtract(1, 'day').isBefore(gig.signupEnd, 'day'));

  return (
    <div className='border rounded shadow-md dark:border-neutral-800'>
      <div className='flex flex-col p-4 space-y-2'>
        <div className='flex items-start justify-between flex-nowrap'>
          <Link className='flex-grow' href={`/gig/${gig.id}`}>
            <h4 className='cursor-pointer'>{gig.title}</h4>
          </Link>
          <GigMenu
            target={
              <button className='p-1 text-red-600 rounded hover:bg-red-600/10'>
                <IconDotsVertical />
              </button>
            }
            dropdown={<GigMenuContent gig={gig} isAdmin={isAdmin} />}
          />
        </div>
        <div className='flex flex-col justify-between lg:flex-row'>
          <Link className='flex-grow' href={`/gig/${gig.id}`}>
            <div className='flex items-center flex-grow space-x-4 cursor-pointer'>
              <Datebox date={dayjs(gig.date)} />
              <div className='text-xs leading-normal'>
                <i>{gig.type.name}</i>
                <br />
                {!!gig.location && `${gig.location}`}
                {!!gig.location && <br />}
                {!!gig.meetup && `Samling: ${gig.meetup}`}
                {!!gig.meetup && <br />}
                {!!gig.start && `Spelstart: ${gig.start}`}
              </div>
            </div>
          </Link>
          <div className='w-full lg:w-56'>
            {showSignup && (
              <GigSignupBox
                gigId={gig.id}
                checkbox1={gig.checkbox1}
                checkbox2={gig.checkbox2}
              />
            )}
          </div>
        </div>
        <div className='text'>{gig.description}</div>
      </div>
    </div>
  );
};

export default GigCard;
