import { Gig } from '@prisma/client';
import React, { Suspense } from 'react';
import GigCard from 'components/gig/card';
import GigSkeleton from 'components/gig/skeleton';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import Votation from './votation';
import VotationResults from './votation-results';

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
  const [gigs, corps] = await Promise.all([
    api.gig.getMany.query({ startDate: currentDate }),
    api.corps.getSelf.query(),
  ]);
  const language = corps?.language ?? 'sv';

  if (gigs.length === 0) {
    return null;
  }

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
    const month = gigDate?.toLocaleDateString(language, { month: 'long' });
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

const noGigs = (
  <div className='flex flex-col gap-2 italic'>
    <p>
      {lang(
        'Just nu finns det inga spelningar inplanerade.',
        'There are no upcoming gigs at the moment.',
      )}
    </p>
  </div>
);

const HomePage = async () => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );
  const month = currentDate.toLocaleDateString('sv-SE', { month: 'long' });

  const [gigs, killerGame, killerPlayer, votation] = await Promise.all([
    makeGigList(),
    api.killer.gameExists.query(),
    api.killer.getOwnPlayerInfo.query(),
    api.votation.getCurrent.query(),
  ]);

  const hasntSignedUpForExistingKillerGame =
    killerGame.exists &&
    killerGame.start &&
    killerGame.start > new Date() &&
    !killerPlayer;

  const now = new Date();
  const votationHasEnded = votation && votation.endsAt < now;

  return (
    <div className='flex max-w-4xl flex-col gap-4'>
      {hasntSignedUpForExistingKillerGame && (
        <div className='-mr-2 flex justify-end motion-safe:animate-bounce dark:text-darkText lg:hidden'>
          {lang('Anmäl dig till Killergame! ⬆️', 'Sign up for Killergame! ⬆️')}
        </div>
      )}
      {votation && votationHasEnded && <VotationResults id={votation.id} />}
      {votation && !votationHasEnded && <Votation votation={votation} />}
      <Suspense
        fallback={
          <>
            <h2 className='text-2xl md:text-4xl'>
              {lang('Kommande spelningar', 'Upcoming gigs')}
            </h2>
            <h3>{`${month.charAt(0)?.toUpperCase()}${month?.slice(1)}`}</h3>
            <GigSkeleton widths={WIDTHS[0]} />
            <GigSkeleton widths={WIDTHS[1]} />
            <GigSkeleton widths={WIDTHS[2]} />
            <GigSkeleton widths={WIDTHS[3]} />
          </>
        }
      >
        <h2 className='text-2xl md:text-4xl'>
          {lang('Kommande spelningar', 'Upcoming gigs')}
        </h2>
        {!gigs && noGigs}
        {gigs}
      </Suspense>
    </div>
  );
};

export default HomePage;
