import { Box, Title } from '@mantine/core';
import React from 'react';
import GigCard from '../../../components/gig/card';
import Loading from '../../../components/loading';
import SignupList from '../../../components/signup-list';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import GigSkeleton from '../../../components/gig/skeleton';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';

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

const LIST_WIDTH = '800px';

const WhosComing = () => {
  const router = useRouter();
  const gigId = router.query.id as string;

  const { data: gig, status: gigStatus } = trpc.gig.getWithId.useQuery(
    { gigId },
    { enabled: !!router.isReady },
  );

  const loading = gigStatus === 'loading';
  const gigHasHappened = gig
    ? gig.date.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24
    : false;

  return (
    <Box sx={{ maxWidth: LIST_WIDTH }}>
      <Title order={2}>Anmälningar</Title>
      {gig ? <GigCard gig={gig} /> : <GigSkeleton />}
      {loading && (
        <Box sx={{ maxWidth: 'fit-content' }}>
          <Loading msg='Laddar anmälningar...' />
        </Box>
      )}
      {!loading && <SignupList gigId={gigId} gigHasHappened={gigHasHappened} />}
    </Box>
  );
};

export default WhosComing;
