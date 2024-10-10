import React, { Suspense } from 'react';
import StatisticsTable from 'app/stats/statistics-table';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { calcOperatingYearInterval, getOperatingYear } from 'utils/date';
import { Metadata } from 'next';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import StatsYearSelect from './year-select';

export const metadata: Metadata = {
  title: 'Statistik',
};

const Statistics = ({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) => {
  if (!searchParams || !searchParams.start) {
    const { start, end: _end } = calcOperatingYearInterval(getOperatingYear());
    redirect(`/stats?start=${dayjs(start).format('YYYY-MM-DD')}`);
  }

  const start = new Date(searchParams.start);
  const end = !!searchParams.end ? new Date(searchParams.end) : undefined;

  return (
    <div className='flex max-w-max flex-col gap-2'>
      <h2>{lang('Statistik', 'Statistics')}</h2>
      <div className='flex items-center gap-4'>
        <div className='w-36'>
          <StatsYearSelect label={lang('Verksamhetsår', 'Operating year')} />
        </div>
      </div>
      <Suspense
        key={`${start}_${end}`}
        fallback={
          <Loading
            msg={lang('Hämtar statistik...', 'Fetching statistics...')}
          />
        }
      >
        <StatisticsTable start={start} end={end} />
      </Suspense>
    </div>
  );
};

export default Statistics;
