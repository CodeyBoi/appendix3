import Loading from 'components/loading';
import GigCard from 'components/gig/card';
import SignupList from './signup-list';
import { Suspense } from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

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

const GigPage = ({ params }: { params: { id: string } }) => {
  const gigId = params.id;
  return (
    <div className='flex max-w-4xl flex-col space-y-4'>
      <h2>{lang('Anmälningar', 'Signups')}</h2>
      <GigCard gig={gigId} />
      <Suspense
        fallback={
          <Loading msg={lang('Hämtar anmälningar...', 'Fetching signups...')} />
        }
      >
        <SignupList gigId={gigId} />
      </Suspense>
    </div>
  );
};

export default GigPage;
