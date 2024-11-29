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
import DownloadStrecklistButton from './download';
import StreckListTable from './view/strecklist-table';

const AdminStreckPage = async () => {
  const [activeCorps, items, bleckhornenBalance] = await Promise.all([
    api.streck.getActiveCorps.query({}),
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
          <h3>{lang('Senaste strecklistor', 'Latest strecklists')}</h3>
          <div>
            <Suspense
              fallback={
                <Loading
                  msg={lang(
                    'Hämtar strecklistor...',
                    'Fetching strecklists...',
                  )}
                />
              }
            >
              <StreckListTable take={50} showDelete />
            </Suspense>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Button href='streck/view'>
            <IconSearch />
            {lang('Se transaktioner...', 'See transactions...')}
          </Button>
          <Button href='streck/deposition/new'>
            <IconCash />
            {lang('Ny kostnad/insättning...', 'New payment/deposit...')}
          </Button>
          <Button href='streck/view/new'>
            <IconTablePlus />
            {lang('Inför strecklista...', 'Submit strecklist...')}
          </Button>
          <DownloadStrecklistButton activeCorps={activeCorps} items={items} />
          <Button href='/admin/streck/prices'>
            <IconCoins />
            {lang('Ändra priser...', 'Change prices...')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStreckPage;
