import { api } from 'trpc/server';
import AdminStreckForm from './form';

const AdminStreckFormPage = async ({ params }: { params: { id: string } }) => {
  const items = await api.streck.getItems.query();
  const { id } = params;
  const newList = id === 'new';

  const transactions = newList
    ? undefined
    : (
        await api.streck.getTransactions.query({
          streckListId: +params.id,
        })
      ).data;

  return (
    <div className='flex flex-col'>
      <AdminStreckForm
        items={items}
        transactions={transactions}
        id={newList ? undefined : +id}
      />
    </div>
  );
};

export default AdminStreckFormPage;
