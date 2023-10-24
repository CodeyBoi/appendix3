'use client';

import Select, { SelectProps } from 'components/input/select';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { calcOperatingYearInterval } from 'utils/date';
import React from 'react';

const StatsYearSelect = (props: Omit<SelectProps, 'onChange'>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startParam = searchParams?.get('start');
  const start = startParam ? dayjs(startParam).year() : dayjs().year();
  const handleChange = (val: number | string) => {
    if (typeof val === 'string') {
      val = parseInt(val);
    }
    const { start, end } = calcOperatingYearInterval(val);
    router.replace(
      `/stats?start=${dayjs(start).format('YYYY-MM-DD')}&end=${dayjs(
        end,
      ).format('YYYY-MM-DD')}`,
    );
  };

  return <Select {...props} onChange={handleChange} defaultValue={start} />;
};

export default StatsYearSelect;
