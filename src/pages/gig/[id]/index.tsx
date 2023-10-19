import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getServerAuthSession } from 'server/common/get-server-auth-session';
import { trpc } from 'utils/trpc';
import dynamic from 'next/dynamic';
import GigSkeleton from 'components/gig/skeleton';
import Loading from 'components/loading';

const skeleton = <GigSkeleton />;
const loader = <Loading msg='Laddar anmälningar...' />;

const SignupList = dynamic(() => import('components/signup-list'), {
  loading: () => loader,
});
const GigCard = dynamic(() => import('components/gig/card'), {
  loading: () => skeleton,
});

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
      {gig ? <GigCard gig={gig} /> : skeleton}
      {loading && loader}
      {!loading && gig && <SignupList gig={gig} />}
    </div>
  );
};

export default GigPage;
