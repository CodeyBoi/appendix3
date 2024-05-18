import { api } from 'trpc/server';
import AdminStreckForm from './form';

const AdminStreckFormPage = async () => {
  const items = await api.streck.getItems.query();
  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <AdminStreckForm items={items} />
      </div>
    </div>
  );
};

export default AdminStreckFormPage;
