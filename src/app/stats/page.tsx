import React, { Suspense } from 'react';
import StatisticsTable from 'app/stats/statistics-table';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { calcOperatingYearInterval, getOperatingYear } from 'utils/date';
import { Metadata } from 'next';
import Loading from 'components/loading';

export const metadata: Metadata = {
  title: 'Statistik',
};

const Statistics = ({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) => {
  if (!searchParams || !searchParams.end || !searchParams.start) {
    const { start, end } = calcOperatingYearInterval(getOperatingYear());
    redirect(
      `/stats?start=${dayjs(start).format('YYYY-MM-DD')}&end=${dayjs(
        end,
      ).format('YYYY-MM-DD')}`,
    );
  }

  const start = new Date(searchParams.start);
  const end = new Date(searchParams.end);

  return (
    <Suspense
      key={`${start}_${end}`}
      fallback={<Loading msg={`Hämtar statistik...`} />}
    >
      <StatisticsTable start={start} end={end} />
    </Suspense>
  );
};

export default Statistics;
