import { Box } from '@mantine/core';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GigCard from '../../../components/gig/card';
import GigSkeleton from '../../../components/gig/skeleton';
import Loading from '../../../components/loading';
import SignupList from '../../../components/signup-list';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';
import { trpc } from '../../../utils/trpc';

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

const GigPage = () => {
  const router = useRouter();
  const gigId = router.query.id as string;

  const { data: gig, status: gigStatus } = trpc.gig.getWithId.useQuery(
    { gigId },
    { enabled: !!router.isReady },
  );

  const loading = gigStatus === 'loading';

  return (
    <div className='flex flex-col max-w-4xl space-y-4'>
      {gig?.title && (
        <Head>
          <title>{gig.title}</title>
        </Head>
      )}
      <h2>Anmälningar</h2>
      {gig ? <GigCard gig={gig} /> : <GigSkeleton />}
      {loading && (
        <Box sx={{ maxWidth: 'fit-content' }}>
          <Loading msg='Laddar anmälningar...' />
        </Box>
      )}
      {!loading && gig && <SignupList gig={gig} />}
    </div>
  );
};

export default GigPage;
