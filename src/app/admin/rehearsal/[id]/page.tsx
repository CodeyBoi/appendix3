import Rehearsal from 'components/rehearsal';
import { api } from 'trpc/server';

const AdminRehearsal = async ({ params }: { params: { id: string } }) => {
  const rehearsal = await api.rehearsal.getWithId.query(params.id);
  return (
    <div className='flex max-w-2xl flex-col gap-2'>
      {rehearsal ? (
        <Rehearsal rehearsal={rehearsal} />
      ) : (
        <h3>Repan kunde inte hittas.</h3>
      )}
    </div>
  );
};

export default AdminRehearsal;
