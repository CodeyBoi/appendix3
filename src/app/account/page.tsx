import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { api } from 'trpc/server';

const AccountPreferences = dynamic(() => import('app/account/preferences'));
const CorpsStats = dynamic(() => import('app/account/stats'));

export const metadata: Metadata = {
  title: 'Mina sidor',
};

const Account = async () => {
  const corps = await api.corps.getSelf.query();
  const corpsName =
    corps?.number !== null
      ? '#' + corps?.number.toString()
      : 'p.e. ' + corps?.lastName;

  return (
    <div className='flex flex-col max-w-3xl gap-2'>
      <h2>{`Välkommen${corps ? ', ' + corpsName : ''}!`}</h2>
      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
        <CorpsStats />
        <AccountPreferences />
      </div>
    </div>
  );
};

export default Account;
