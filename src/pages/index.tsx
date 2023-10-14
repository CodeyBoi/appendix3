import { Gig } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import React from 'react';
import GigCard from '../components/gig/card';
import GigSkeleton from '../components/gig/skeleton';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: 'api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

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

const Home: NextPage = () => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );

  const { data: gigs, isLoading: gigsLoading } = trpc.gig.getMany.useQuery({
    startDate: currentDate,
  });

  const month = currentDate.toLocaleDateString('sv-SE', { month: 'long' });

  return (
    // <Stack sx={{ maxWidth: 800 }} spacing='xs'>
    <div className='flex flex-col max-w-4xl space-y-4'>
      <h2 className='text-2xl md:text-4xl'>
        {gigs && gigs.length === 0
          ? 'Inga kommande spelningar :('
          : 'Kommande spelningar'}
      </h2>
      <div className='flex flex-col space-y-4'>
        {gigsLoading && (
          <>
            <h3>{`${month.charAt(0)?.toUpperCase()}${month?.slice(1)}`}</h3>
            <GigSkeleton />
            <GigSkeleton />
            <GigSkeleton />
            <GigSkeleton />
          </>
        )}
        {gigs && makeGigList(gigs)}
      </div>
    </div>
  );
};

export default Home;
