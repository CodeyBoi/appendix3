import { Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import Loading from '../../../../components/loading';
import { trpc } from '../../../../utils/trpc';
import AlertError from '../../../../components/alert-error';
import Rehearsal from '../../../../components/rehearsal';
import RehearsalForm from '../../../../components/rehearsal/form';

const MAX_TRIES = 3;

const AdminRehearsal = () => {
  const router = useRouter();
  const rehearsalId = router.query.id as string | undefined;
  const newRehearsal = rehearsalId === 'new';

  const { data: rehearsal, failureCount } = trpc.rehearsal.getWithId.useQuery(
    rehearsalId ?? '',
    { enabled: !newRehearsal && !!rehearsalId },
  );

  return (
    <Stack align='flex-start' sx={{ maxWidth: '700px' }}>
      {!newRehearsal && !rehearsal && failureCount < MAX_TRIES && (
        <Loading msg='Laddar repa...' />
      )}
      {!newRehearsal && failureCount >= MAX_TRIES && (
        <AlertError msg='Kunde inte hämta repa. Har du mixtrat med URL:en?' />
      )}
      {!newRehearsal && rehearsal && <Rehearsal rehearsal={rehearsal} />}
      {newRehearsal && <RehearsalForm />}
    </Stack>
  );
};

export default AdminRehearsal;
