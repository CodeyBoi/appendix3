'use client';

import AlertError from 'components/alert-error';
import dynamic from 'next/dynamic';
import Loading from 'components/loading';
import { api } from 'trpc/react';

const Rehearsal = dynamic(() => import('components/rehearsal'));

const MAX_TRIES = 3;

const AdminRehearsal = ({ params }: { params: { id: string } }) => {
  const rehearsalId = params.id;

  const { data: rehearsal, failureCount } = api.rehearsal.getWithId.useQuery(
    rehearsalId ?? '',
    { enabled: !!rehearsalId },
  );

  return (
    <div className='flex flex-col max-w-2xl gap-2'>
      {!rehearsal && failureCount < MAX_TRIES && (
        <Loading msg='Laddar repa...' />
      )}
      {failureCount >= MAX_TRIES && (
        <AlertError msg='Kunde inte hämta repa. Har du mixtrat med URL:en?' />
      )}
      {rehearsal && <Rehearsal rehearsal={rehearsal} />}
    </div>
  );
};

export default AdminRehearsal;
