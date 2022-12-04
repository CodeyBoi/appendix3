import { Box, Title, Center } from '@mantine/core';
import React from 'react';
import GigInfo from '../../../components/gig/info';
import Loading from '../../../components/loading';
import SignupList from '../../../components/signup-list';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';

const LIST_WIDTH = "700px";

const WhosComing = () => {
  const router = useRouter();
  const gigId = router.query.gigId as string;

  const { data: gig, status: gigStatus } =
    trpc.gig.getWithId.useQuery({ gigId }, { enabled: !!router.isReady });

  const loading = gigStatus === "loading";

  return (
    <Center>
      <Box sx={{ maxWidth: LIST_WIDTH, fontSize: "xs" }}>
        <Title order={1}>Anmälningar</Title>
        {gig ? <GigInfo gig={gig} /> : <Loading msg='Laddar spelning...'  />}
        {loading && <Box sx={{ maxWidth: "fit-content" }}><Loading msg='Laddar anmälningar...' /></Box>}
        {!loading && <SignupList gigId={gigId} />}
      </Box>
    </Center>
  );

}

export default WhosComing;
