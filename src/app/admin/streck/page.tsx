import {
  IconCash,
  IconCoins,
  IconSearch,
  IconTablePlus,
} from '@tabler/icons-react';
import Button from 'components/input/button';
import Loading from 'components/loading';
import React, { Suspense } from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import TransactionsTable from './view/transactions-table';
import DownloadStrecklistButton from './download';

const AdminStreckPage = async () => {
  const [activeCorps, items, bleckhornenBalance] = await Promise.all([
    api.streck.getActiveCorps.query({}),
    api.streck.getItems.query(),
    api.streck.getBleckhornenBalance.query(),
  ]);
  return (
    <div className='flex flex-col gap-4'>
      <h2>Streckkonton</h2>
      <h5>{`Corpssaldo: ${bleckhornenBalance.toString()}`}</h5>
      <div className='flex flex-col-reverse gap-4 md:flex-row'>
        <div className='flex grow flex-col gap-2'>
          <h3>Senaste händelser</h3>
          <div>
            <Suspense
              fallback={
                <Loading
                  msg={lang(
                    'Hämtar transaktioner...',
                    'Fetching transactions...',
                  )}
                />
              }
            >
              <TransactionsTable />
            </Suspense>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Button href='streck/view'>
            <IconSearch />
            Se transaktioner...
          </Button>
          <Button href='streck/deposition/new'>
            <IconCash />
            Ny kostnad/insättning...
          </Button>
          <Button href='streck/new'>
            <IconTablePlus />
            Inför ny strecklista...
          </Button>
          <DownloadStrecklistButton activeCorps={activeCorps} items={items} />
          <Button href='/admin/streck/prices'>
            <IconCoins />
            Ändra priser...
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStreckPage;
