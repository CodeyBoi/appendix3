import ParamsDatePicker from 'components/input/params-date-picker';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import dayjs from 'dayjs';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import TransactionsSummary from './transactions-summary';
import StreckListTable from '../strecklist-table';

export const metadata: Metadata = {
  title: 'Streck',
};

const AdminStreckEditPage = ({
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
      <div className='w-72'>
        <ParamsDatePicker
          paramName='start'
          label='Från och med'
          defaultValue={start}
        />
      </div>
      <div className='w-72'>
        <ParamsDatePicker paramName='end' label='Till och med' />
      </div>
      <Suspense
        key={`${dayjs(start).format('YYYYMMDD')}_${dayjs(end).format(
          'YYYYMMDD',
        )}`}
        fallback={
          <Loading
            msg={lang('Hämtar strecklistor...', 'Fetching strecklists...')}
          />
        }
      >
        <h3>Sammanfattning</h3>
        <TransactionsSummary start={start} end={end} take={0x1337} />
        <h3>Alla strecklistor</h3>
        <StreckListTable start={start} end={end} showDelete showDownloadAll />
      </Suspense>
    </div>
  );
};

export default AdminStreckEditPage;
