import Link from 'next/link';
import React, { Fragment } from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

interface GigListProps {
  year: number;
  tab: string;
}

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

const numberSuffix = (n: number) => {
  const lastDigit = n % 10;
  return lastDigit === 1 || lastDigit === 2 ? 'a' : 'e';
};

const GigList = async ({ year, tab }: GigListProps) => {
  const [gigs, corps] = await Promise.all([
    fetchGigs(year, tab),
    api.corps.getSelf.query(),
  ]);
  const language = corps?.language ?? 'sv';

  if (gigs.length === 0) {
    return (
      <h3 className='p-4'>
        {lang('Här fanns inget att se... :/', 'Nothing to see here... :/')}
      </h3>
    );
  }

  let lastGigMonth: number;
  return (
    <div className='flex flex-col divide-y divide-solid dark:divide-neutral-700'>
      {gigs.map((gig) => {
        const gigMonth = gig.date.getMonth();
        const gigDate = gig.date.getDate();
        let shouldAddMonth = false;
        if (gigMonth !== lastGigMonth) {
          lastGigMonth = gigMonth;
          shouldAddMonth = true;
        }
        return (
          <Fragment key={gig.id}>
            {shouldAddMonth && (
              <h3 className='pt-2'>
                {gig.date.toLocaleString(language, { month: 'long' })}
              </h3>
            )}
            <Link href={`/gig/${gig.id}`} key={gig.id}>
              <div className='flex cursor-pointer items-center gap-2 py-1 pl-2 hover:bg-red-300/5'>
                <div className='w-6 shrink-0 text-right'>
                  {gigDate.toString() + ':' + numberSuffix(gigDate)}
                </div>
                {gig.title.trim() + (gig.countsPositively ? '*' : '')}
              </div>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
};

export default GigList;
