import RehearsalForm from 'components/rehearsal/form';
import { api } from 'trpc/server';

const getRehearsal = async (id: string) => {
  if (id === 'new') {
    return null;
  }
  return await api.rehearsal.getWithId.query(id);
};

const AdminRehearsalEditPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const rehearsal = await getRehearsal(params.id);
  return <RehearsalForm rehearsal={rehearsal ?? undefined} />;
};

export default AdminRehearsalEditPage;
