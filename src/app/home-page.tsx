import { Gig } from '@prisma/client';
import React, { Suspense } from 'react';
import GigCard from 'components/gig/card';
import GigSkeleton from 'components/gig/skeleton';

type HomePageProps = {
  gigs: (Gig & { type: { name: string } } & {
    hiddenFor: { corpsId: string }[];
  })[];
};

const WIDTHS = [
  [200, 120, 95, 0.6],
  [110, 75, 70, 0.2],
  [235, 105, 95, 0.1],
  [145, 155, 135, 0.4],
];

const makeGigList = (
  gigs: (Gig & { type: { name: string } } & {
    hiddenFor: { corpsId: string }[];
  })[],
) => {
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

const HomePage = ({ gigs }: HomePageProps) => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );

  const month = currentDate.toLocaleDateString('sv-SE', { month: 'long' });

  return (
    <div className='flex flex-col max-w-4xl space-y-4'>
      <h2 className='text-2xl md:text-4xl'>
        {gigs && gigs.length === 0
          ? 'Inga kommande spelningar :('
          : 'Kommande spelningar'}
      </h2>
      <div className='flex flex-col space-y-4'>
        <Suspense
          fallback={
            <>
              <h3>{`${month.charAt(0)?.toUpperCase()}${month?.slice(1)}`}</h3>
              <GigSkeleton widths={WIDTHS[0]} />
              <GigSkeleton widths={WIDTHS[1]} />
              <GigSkeleton widths={WIDTHS[2]} />
              <GigSkeleton widths={WIDTHS[3]} />
            </>
          }
        >
          {makeGigList(gigs)}
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
