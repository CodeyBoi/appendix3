import { api } from 'trpc/server';
import AdminStreckForm from './form';

const AdminStreckFormPage = async () => {
  const items = await api.streck.getItems.query();
  const activeCorps = await api.streck.getActiveCorps.query();
  console.log({ activeCorps });
  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <AdminStreckForm items={items} activeCorps={activeCorps} />
      </div>
    </div>
  );
};

export default AdminStreckFormPage;
