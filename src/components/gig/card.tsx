import { Modal } from '@mantine/core';
import { Gig } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { trpc } from '../../utils/trpc';
import Datebox from './datebox';
import GigForm from './form';
import GigMenu from './menu';
import GigSignupBox from './signup-box';

interface GigCardProps {
  gig: Gig & { type: { name: string } } & { hiddenFor: { corpsId: string }[] };
}

const GigCard = ({ gig }: GigCardProps) => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === 'admin';
  const [opened, setOpened] = React.useState(false);

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
    <>
      <Modal
        title={<h3>Uppdatera spelning</h3>}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <GigForm gig={gig} onSubmit={() => setOpened(false)} />
      </Modal>
      <div className='border rounded shadow-md dark:border-neutral-800'>
        <div className='flex flex-col p-4 space-y-2'>
          <div className='flex items-start justify-between flex-nowrap'>
            <Link href={`/gig/${gig.id}`}>
              <h4 className='cursor-pointer'>{gig.title}</h4>
            </Link>
            <GigMenu gig={gig} isAdmin={isAdmin} setOpened={setOpened} />
          </div>
          <div className='flex flex-col justify-between lg:flex-row'>
            <div className='flex flex-grow'>
              <Link href={`/gig/${gig.id}`}>
                <div className='flex flex-row items-center flex-grow space-x-4 cursor-pointer'>
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
            </div>
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
    </>
  );
};

export default GigCard;
