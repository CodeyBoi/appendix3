import dayjs from 'dayjs';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { api } from 'trpc/server';

type GigListProps = {
  year: number;
  tab: string;
};

const fetchGigs = async (year: number, tab: string) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  if (tab === 'my') {
    return api.gig.getAttended.query({ startDate, endDate });
  } else {
    return api.gig.getMany.query({
      startDate,
      endDate,
      dateOrder: 'desc',
    });
  }
};

const GigList = async ({ year, tab }: GigListProps) => {
  const gigs = await fetchGigs(year, tab);

  if (gigs.length === 0) {
    return <h3 className='p-4'>Här fanns inget att se... :/</h3>;
  }

  let lastGigMonth: number;
  return (
    <div className='flex flex-col divide-y divide-solid dark:divide-neutral-700'>
      {gigs.map((gig) => {
        const gigMonth = gig.date.getMonth();
        let shouldAddMonth = false;
        if (gigMonth !== lastGigMonth) {
          lastGigMonth = gigMonth;
          shouldAddMonth = true;
        }
        return (
          <Fragment key={gig.id}>
            {shouldAddMonth && (
              <h3 className='pt-2'>
                {gig.date.toLocaleString('sv-SE', { month: 'long' })}
              </h3>
            )}
            <Link href={`/gig/${gig.id}`} key={gig.id}>
              <div className='flex items-center gap-2 py-1 pl-2 cursor-pointer hover:bg-red-300/5'>
                <div className='flex-shrink-0 w-24'>
                  {dayjs(gig.date).format('YYYY-MM-DD')}
                </div>
                {gig.title}
              </div>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
};

export default GigList;
