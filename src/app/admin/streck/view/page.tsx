import ParamsDatePicker from 'components/input/params-date-picker';
import React, { Suspense } from 'react';
import TransactionsTable from './transactions-table';
import { Metadata } from 'next';
import dayjs from 'dayjs';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import TransactionsSummary from './transactions-summary';

export const metadata: Metadata = {
  title: 'Streck',
};

const AdminStreckViewPage = async ({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) => {
  const start = (
    searchParams.start
      ? dayjs(searchParams.start)
      : dayjs().subtract(1, 'month')
  )
    .startOf('day')
    .toDate();
  const end = (searchParams.end ? dayjs(searchParams.end) : dayjs())
    .endOf('day')
    .toDate();

  return (
    <div className='flex flex-col gap-4'>
      <h2>Transaktioner</h2>
      <div className='flex flex-row gap-2'>
        <div className='w-36'>
          <ParamsDatePicker
            paramName='start'
            label='Startdatum'
            defaultValue={start}
          />
        </div>
        <div className='w-36'>
          <ParamsDatePicker paramName='end' label='Slutdatum' />
        </div>
      </div>
      <Suspense
        key={`${start}_${end}`}
        fallback={
          <Loading
            msg={lang('Hämtar transaktioner...', 'Fetching transactions...')}
          />
        }
      >
        <h3>Sammanfattning</h3>
        <TransactionsSummary start={start} end={end} take={0x1337} />
        <h3>Alla transaktioner</h3>
        <TransactionsTable
          start={start}
          end={end}
          showCorps
          take={0x1337}
          showDelete
        />
      </Suspense>
    </div>
  );
};

export default AdminStreckViewPage;
