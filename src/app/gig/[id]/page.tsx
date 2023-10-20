import Head from 'next/head';
import Loading from 'components/loading';
import GigCard from 'components/gig/card';
import SignupList from 'components/signup-list';
import { Suspense } from 'react';
import GigSkeleton from 'components/gig/skeleton';

const GigPage = async ({ params }: { params: { id: string } }) => {
  const gigId = params.id;
  return (
    <div className='flex flex-col max-w-4xl space-y-4'>
      <Head>
        <title>Anmälningar</title>
      </Head>
      <h2>Anmälningar</h2>
      <Suspense fallback={<GigSkeleton />}>
        <GigCard gig={gigId} />
      </Suspense>
      <Suspense fallback={<Loading msg='Laddar anmälningar...' />}>
        <SignupList gigId={gigId} />
      </Suspense>
    </div>
  );
};

export default GigPage;
