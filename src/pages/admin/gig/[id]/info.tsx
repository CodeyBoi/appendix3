import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '../../../../utils/trpc';
import { Box, Space } from '@mantine/core';
import GigCard from '../../../../components/gig/card';
import Loading from '../../../../components/loading';
import FoodPrefs from '../../../../components/signup-list/food-prefs';

const LIST_WIDTH = '800px';

const GigAdminInfo = () => {
  const router = useRouter();
  const gigId = router.query.id as string;
  const { data: gig } = trpc.gig.getWithId.useQuery({ gigId });
  const { data: signups } = trpc.gig.getSignups.useQuery({ gigId });

  const corpsIds = signups?.map((signup) => signup.corpsId);

  const { data: foodPrefs } = trpc.corps.getFoodPreferences.useQuery(
    {
      corpsIds: corpsIds as string[],
    },
    {
      enabled: !!corpsIds,
    },
  );

  return (
    <Box sx={{ maxWidth: LIST_WIDTH }}>
      {gig ? <GigCard gig={gig} /> : <Loading msg='Laddar spelning...' />}
      <Space h='md' />
      {signups && foodPrefs && (
        <FoodPrefs gigId={gigId} foodPrefs={foodPrefs} />
      )}
    </Box>
  );
};

export default GigAdminInfo;
