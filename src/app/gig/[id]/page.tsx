import Loading from 'components/loading';
import GigCard from 'components/gig/card';
import SignupList from 'components/signup-list';
import { Suspense } from 'react';
import GigSkeleton from 'components/gig/skeleton';
import { api } from 'trpc/server';

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const gig = await api.gig.getWithId.query({ gigId: params.id });
  return gig
    ? {
        title: gig.title,
        description: gig.description,
      }
    : {
        title: 'Spelning finns inte',
      };
};

const GigPage = async ({ params }: { params: { id: string } }) => {
  const gigId = params.id;
  return (
    <div className='flex flex-col max-w-4xl space-y-4'>
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
