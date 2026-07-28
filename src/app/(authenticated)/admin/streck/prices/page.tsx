import { api } from 'trpc/server';
import AdminStreckPricesForm from './form';

const AdminStreckPricesPage = async () => {
  const items = await api.streck.getItems.query();
  return <AdminStreckPricesForm initialItems={items} />;
};

export default AdminStreckPricesPage;
