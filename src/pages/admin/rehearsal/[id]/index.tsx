import { useRouter } from 'next/router';
import AlertError from '../../../../components/alert-error';
import Loading from '../../../../components/loading';
import Rehearsal from '../../../../components/rehearsal';
import { trpc } from '../../../../utils/trpc';

const MAX_TRIES = 3;

const AdminRehearsal = () => {
  const router = useRouter();
  const rehearsalId = router.query.id as string | undefined;

  const { data: rehearsal, failureCount } = trpc.rehearsal.getWithId.useQuery(
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
