import { useRouter } from 'next/router.js';
import { trpc } from '../../../../utils/trpc';
import FormLoadingOverlay from '../../../../components/form-loading-overlay';
import GigForm from '../../../../components/gig/form';
import { Stack, Title } from '@mantine/core';

const AdminGig = () => {
  const router = useRouter();
  const gigId = router.query.id as string;
  const newGig = gigId === 'new';

  const { data: gig, isInitialLoading } = trpc.gig.getWithId.useQuery(
    { gigId },
    { enabled: !newGig && !!gigId },
  );

  return (
    <Stack align={'flex-start'}>
      {newGig ? (
        <Title order={2}>Skapa spelning</Title>
      ) : (
        <Title order={2}>Uppdatera spelning</Title>
      )}
      <FormLoadingOverlay visible={isInitialLoading}>
        <GigForm
          gig={!!gig ? gig : undefined}
          onSubmit={() => router.push('/')}
        />
      </FormLoadingOverlay>
    </Stack>
  );
};

export default AdminGig;
