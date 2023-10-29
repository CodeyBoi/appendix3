import { Gig } from '@prisma/client';
import React, { Suspense } from 'react';
import GigCard from 'components/gig/card';
import GigSkeleton from 'components/gig/skeleton';
import { api } from 'trpc/server';

const WIDTHS = [
  [200, 120, 95, 0.6],
  [110, 75, 70, 0.2],
  [235, 105, 95, 0.1],
  [145, 155, 135, 0.4],
];

const makeGigList = async () => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );
  const gigs = await api.gig.getMany.query({ startDate: currentDate });

  let lastMonth = -1;
  const gigsByMonth = gigs.reduce(
    (acc, gig) => {
      const month = gig.date.getMonth();
      const newMonth = month !== lastMonth;
      lastMonth = month;
      if (newMonth) {
        acc.push([]);
      }
      acc.at(-1)?.push(gig);
      return acc;
    },
    [] as (Gig & { type: { name: string } } & {
      hiddenFor: { corpsId: string }[];
    })[][],
  );

  const gigList = gigsByMonth.map((gigs) => {
    const gigDate = gigs[0]?.date;
    const month = gigDate?.toLocaleDateString('sv-SE', { month: 'long' });
    const year = gigDate?.getFullYear();
    return (
      <React.Fragment key={`${month} ${year}`}>
        <h3>{`${month?.charAt(0)?.toUpperCase()}${month?.slice(1)}`}</h3>
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </React.Fragment>
    );
  });

  return gigList;
};

const HomePage = async () => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );
  const month = currentDate.toLocaleDateString('sv-SE', { month: 'long' });
  return (
    <div className='flex max-w-4xl flex-col gap-4'>
      <Suspense
        fallback={
          <>
            <h2 className='text-2xl md:text-4xl'>Kommande spelningar</h2>
            <h3>{`${month.charAt(0)?.toUpperCase()}${month?.slice(1)}`}</h3>
            <GigSkeleton widths={WIDTHS[0]} />
            <GigSkeleton widths={WIDTHS[1]} />
            <GigSkeleton widths={WIDTHS[2]} />
            <GigSkeleton widths={WIDTHS[3]} />
          </>
        }
      >
        <h2 className='text-2xl md:text-4xl'>Kommande spelningar</h2>
        {await makeGigList()}
      </Suspense>
    </div>
  );
};

export default HomePage;
