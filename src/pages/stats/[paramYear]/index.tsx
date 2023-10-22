import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Loading from 'components/loading';
import { getServerAuthSession } from 'server/common/get-server-auth-session';
import dynamic from 'next/dynamic';
import Select from 'components/select';

const StatisticsTable = dynamic(() => import('components/statistics-table'), {
  loading: () => <Loading msg='Laddar statistik...' />,
});

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: 'api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

export const getOperatingYear = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return month >= 8 ? year : year - 1;
};

const calcInterval = (year: number) => {
  const start = new Date(year, 8, 1); // September 1st
  const operatingYearEnd = new Date(year + 1, 7, 31); // August 31st next year
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  // If we're in the same year, we want to show the stats up to today
  const end = currentDate < operatingYearEnd ? currentDate : operatingYearEnd;
  return { start, end };
};

const startOperatingYear = 2010;
const operatingYears = Array.from(
  { length: getOperatingYear() - startOperatingYear + 1 },
  (_, i) => startOperatingYear + i,
).reverse();

const Statistics: NextPage = () => {
  const currentOperatingYear = getOperatingYear();

  const router = useRouter();
  const { paramYear } = router.query as { paramYear: string };

  const year = parseInt(paramYear) || currentOperatingYear;

  const { start: initialStart, end: initialEnd } = calcInterval(year);
  const [statsInterval, setStatsInterval] =
    React.useState<DateRangePickerValue>([initialStart, initialEnd]);
  const [showCustomInterval, setShowCustomInterval] = React.useState(
    paramYear === 'custom',
  );

  const handleYearChange = (year: string) => {
    if (!year) {
      return;
    }
    setShowCustomInterval(year === 'custom');
    const y = parseInt(year);
    if (y) {
      const { start, end } = calcInterval(y);
      setStatsInterval([start, end]);
    }
    router.push(`/stats/${year}`);
  };

  if (!router.isReady) {
    return <Loading msg='Laddar statistik...' />;
  }

  const yearData =
    operatingYears?.map((y) => ({
      label: `${y}-${y + 1}`,
      value: y.toString(),
    })) ?? [];
  yearData.push({ label: 'Eget intervall...', value: 'custom' });

  return (
    <div className='flex flex-col gap-2 max-w-max'>
      <Head>
        <title>{`Statistik ${year}-${year + 1}`}</title>
      </Head>
      <h2>Statistik</h2>
      <div className='w-36'>
        <Select
          label='Verksamhetsår'
          defaultValue={paramYear}
          options={yearData}
          onChange={handleYearChange}
        />
      </div>
      {showCustomInterval && (
        <div className='w-72'>
          <DateRangePicker
            value={statsInterval}
            onChange={setStatsInterval}
            label='Tidsintervall'
            placeholder='Välj intervall...'
            maxDate={new Date()}
          />
        </div>
      )}
      <StatisticsTable
        start={statsInterval[0] || initialStart}
        end={statsInterval[1] || initialEnd}
      />
    </div>
  );
};

export default Statistics;
