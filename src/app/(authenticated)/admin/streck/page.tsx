import {
  IconCoins,
  IconSearch,
  IconTablePlus,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import Button from 'components/input/button';
import Loading from 'components/loading';
import React, { Suspense } from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import DownloadStrecklistButton from './download-empty';
import StreckListTable from './strecklist-table';
import ParamsSwitch from 'components/input/params-switch';
import Restricted from 'components/restricted/server';

interface AdminStreckPageProps {
  searchParams: {
    showDelete: string;
  };
}

const AdminStreckPage = async ({
  searchParams: { showDelete },
}: AdminStreckPageProps) => {
  const [activeCorps, items, bleckhornenBalance] = await Promise.all([
    api.streck.getCorpsBalances.query({}),
    api.streck.getItems.query(),
    api.streck.getBleckhornenBalance.query(),
  ]);
  return (
    <div className='flex flex-col gap-4'>
      <h2>{lang('Strecklistor', 'Strecklists')}</h2>
      <h5>{`Corpssaldo: ${bleckhornenBalance.balance}`}</h5>
      <h5>{`Summa av negativa saldon: ${bleckhornenBalance.unsettledDebt}`}</h5>
      <div className='flex flex-col-reverse gap-4 md:flex-row'>
        <div className='flex grow flex-col gap-2'>
          <div className='flex flex-nowrap gap-4'>
            <h3>{lang('Senaste transaktioner', 'Latest transactions')}</h3>
            <Restricted permissions='manageStreck'>
              <ParamsSwitch
                paramName='showDelete'
                label={lang('Visa Ta bort-knapp', 'Show Delete button')}
              />
            </Restricted>
          </div>
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
              <StreckListTable take={50} showDelete={!!showDelete} />
            </Suspense>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Button href='streck/accounts'>
            <IconUser />
            {lang('Se streckkonton...', 'View streck accounts...')}
          </Button>
          <Button href='streck/view'>
            <IconSearch />
            {lang('Se transaktioner...', 'View transactions...')}
          </Button>
          <Restricted permissions='manageStreck'>
            <Button href='streck/edit/new'>
              <IconTablePlus />
              {lang('Ny transaktion...', 'New transaktion...')}
            </Button>
          </Restricted>
          <Restricted permissions='manageStreck'>
            <Button href='/admin/streck/prices'>
              <IconCoins />
              {lang('Ändra priser...', 'Change prices...')}
            </Button>
          </Restricted>
          <Restricted permissions='manageStreck'>
            <Button href='/admin/streck/edit/deleted'>
              <IconTrash />
              {lang('Se borttagna listor...', 'View deleted lists...')}
            </Button>
          </Restricted>
          <DownloadStrecklistButton activeCorps={activeCorps} items={items} />
        </div>
      </div>
    </div>
  );
};

export default AdminStreckPage;
