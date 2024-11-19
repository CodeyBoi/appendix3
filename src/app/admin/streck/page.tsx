import {
  IconCoins,
  IconDownload,
  IconSearch,
  IconTablePlus,
} from '@tabler/icons-react';
import Button from 'components/input/button';
import Loading from 'components/loading';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { api } from 'trpc/server';
import { displayName } from 'utils/corps';
import { lang } from 'utils/language';
import TransactionsTable from './view/transactions-table';

const AdminStreckPage = async () => {
  const [activeCorps, items] = await Promise.all([
    api.streck.getActiveCorps.query({}),
    api.streck.getItems.query(),
  ]);

  const downloadLink =
    `data:text/csv;charset=utf-8,Namn,Saldo,${encodeURIComponent(
      items.map((item) => `${item.name} ${item.price}p`).join(',') + '\n',
    )}` +
    encodeURIComponent(
      activeCorps
        .map((corps) => `${displayName(corps)},${corps.balance}`)
        .join('\n'),
    );

  return (
    <div className='flex flex-col gap-4'>
      <h2>Streckkonton</h2>
      <div className='flex flex-col md:flex-row'>
        <div className='flex grow flex-col gap-2'>
          <h3>Senaste händelser</h3>
          <div className='overflow-x-auto'>
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
          <Button href='streck/new'>
            <IconTablePlus />
            Inför ny strecklista...
          </Button>
          <a
            href={downloadLink}
            download={`Strecklista ${dayjs(new Date()).format(
              'YYYY-MM-DD',
            )}.csv`}
          >
            <Button>
              <IconDownload />
              Ladda ner som CSV
            </Button>
          </a>
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
