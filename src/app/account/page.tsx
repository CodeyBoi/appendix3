import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

const AccountPreferences = dynamic(() => import('app/account/preferences'));
const CorpsStats = dynamic(() => import('app/account/stats'));

export const metadata: Metadata = {
  title: 'Mina sidor',
};

const Account = async () => {
  const corps = await api.corps.getSelf.query();
  const corpsName =
    corps.number !== null
      ? '#' + corps.number.toString()
      : 'p.e. ' + corps.lastName;

  return (
    <div className='flex max-w-3xl flex-col gap-2'>
      <h2>
        {lang('Välkommen', 'Welcome')}
        {', ' + corpsName}!
      </h2>
      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
        <CorpsStats />
        <AccountPreferences />
      </div>
    </div>
  );
};

export default Account;
