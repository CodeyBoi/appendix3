import React from 'react';
import { Group, Select, Stack, Title } from '@mantine/core';
import StatisticsTable from '../../../components/statistics-table';
import Loading from '../../../components/loading';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';

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
    <Stack sx={{ maxWidth: 700 }}>
      <Title order={2}>Statistik</Title>
      <Group position='left'>
        <Select
          label='Verksamhetsår'
          defaultValue={paramYear}
          maxDropdownHeight={250}
          data={yearData}
          onChange={handleYearChange}
        />
        {showCustomInterval && (
          <DateRangePicker
            value={statsInterval}
            onChange={setStatsInterval}
            label='Tidsintervall'
            placeholder='Välj intervall...'
            maxDate={new Date()}
            sx={{ width: '100%', maxWidth: 300 }}
          />
        )}
      </Group>
      <StatisticsTable
        start={statsInterval[0] || initialStart}
        end={statsInterval[1] || initialEnd}
      />
    </Stack>
  );
};

export default Statistics;
