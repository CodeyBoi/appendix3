import dynamic from 'next/dynamic';
import Head from 'next/head';
import { trpc } from 'utils/trpc';

const AccountPreferences = dynamic(
  () => import('components/account/preferences'),
);
const CorpsStats = dynamic(() => import('components/account/stats'));

const Account = () => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const corpsName =
    corps?.number !== null
      ? '#' + corps?.number.toString()
      : 'p.e. ' + corps?.lastName;

  return (
    <div className='flex flex-col max-w-3xl gap-2'>
      <Head>
        <title>Mina sidor</title>
      </Head>
      <h2>{`Välkommen${corps ? ', ' + corpsName : ''}!`}</h2>
      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
        <CorpsStats />
        <AccountPreferences />
      </div>
    </div>
  );
};

export default Account;
