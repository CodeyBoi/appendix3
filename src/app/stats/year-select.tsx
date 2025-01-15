'use client';

import Select, { SelectProps } from 'components/input/select';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import {
  calcOperatingYearInterval,
  getOperatingYear,
  startOperatingYear,
} from 'utils/date';
import React, { useState } from 'react';

const operatingYears = Array.from(
  { length: getOperatingYear() - startOperatingYear + 1 },
  (_, i) => startOperatingYear + i,
).reverse();

const StatsYearSelect = (
  props: Omit<SelectProps, 'onChange' | 'options' | 'value' | 'defaultValue'>,
) => {
  const searchParams = useSearchParams();
  const startParam = searchParams?.get('start');
  const start = startParam ? dayjs(startParam).year() : dayjs().year();
  const [year, setYear] = useState<number>(start);
  const yearData = operatingYears.map((y) => ({
    label: `${y}-${y + 1}`,
    value: y,
  }));
  const router = useRouter();
  const handleChange = (val: string) => {
    const newYear = parseInt(val);
    setYear(newYear);
    const { start, end } = calcOperatingYearInterval(newYear);
    const newSearchParams = new URLSearchParams(searchParams?.toString() || '');
    newSearchParams.set('start', dayjs(start).format('YYYY-MM-DD'));
    if (newYear === getOperatingYear()) {
      newSearchParams.delete('end');
    } else {
      newSearchParams.set('end', dayjs(end).format('YYYY-MM-DD'));
    }
    router.replace(`/stats?${newSearchParams.toString()}`);
  };

  return (
    <Select
      {...props}
      onChange={handleChange}
      value={year}
      options={yearData}
    />
  );
};

export default StatsYearSelect;
