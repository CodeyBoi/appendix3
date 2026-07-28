import GigForm from 'components/gig/form';
import { api } from 'trpc/server';

const AdminGig = async ({ params }: { params: { id: string } }) => {
  const gigId = params.id;
  const newGig = gigId === 'new';

  const gig = await api.gig.getWithId.query({ gigId });
  const gigTypes = (await api.gigType.getAll.query()).map((t) => t.name);

  return (
    <div className='flex flex-col gap-2'>
      {newGig ? <h2>Skapa spelning</h2> : <h2>Uppdatera spelning</h2>}
      <GigForm gig={gig ?? undefined} gigTypes={gigTypes} />
    </div>
  );
};

export default AdminGig;
