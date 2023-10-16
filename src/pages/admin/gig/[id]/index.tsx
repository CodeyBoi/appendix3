import { useRouter } from 'next/router.js';
import FormLoadingOverlay from '../../../../components/form-loading-overlay';
import GigForm from '../../../../components/gig/form';
import { trpc } from '../../../../utils/trpc';

const AdminGig = () => {
  const router = useRouter();
  const gigId = router.query.id as string;
  const newGig = gigId === 'new';

  const { data: gig, isInitialLoading } = trpc.gig.getWithId.useQuery(
    { gigId },
    { enabled: !newGig && !!gigId },
  );

  return (
    <div className='flex flex-col gap-2'>
      {newGig ? <h2>Skapa spelning</h2> : <h2>Uppdatera spelning</h2>}
      <FormLoadingOverlay visible={isInitialLoading}>
        <GigForm
          gig={!!gig ? gig : undefined}
          onSubmit={() => router.push('/')}
        />
      </FormLoadingOverlay>
    </div>
  );
};

export default AdminGig;
