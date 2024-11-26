import { api } from 'trpc/server';
import AdminStreckForm from './form';

const AdminStreckFormPage = async ({ params }: { params: { id: string } }) => {
  const items = await api.streck.getItems.query();
  const newList = params.id !== 'new';

  const transactions = newList
    ? undefined
    : (
        await api.streck.getTransactions.query({
          streckListId: +params.id,
        })
      ).data;

  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <AdminStreckForm items={items} transactions={transactions} />
      </div>
    </div>
  );
};

export default AdminStreckFormPage;
