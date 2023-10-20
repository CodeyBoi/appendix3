import { api } from 'trpc/server';
import HomePage from './home-page';

const RootPage = async () => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );
  const gigs = await api.gig.getMany.query({ startDate: currentDate });
  return <HomePage gigs={gigs} />;
};

export default RootPage;
