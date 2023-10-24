'use client';

import Select, { SelectProps } from 'components/input/select';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { calcOperatingYearInterval } from 'utils/date';

const StatsYearSelect = (props: Omit<SelectProps, 'onChange'>) => {
  const router = useRouter();

  const handleChange = (value: number | string) => {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    const { start, end } = calcOperatingYearInterval(value);
    router.replace(
      `/stats?start=${dayjs(start).format('YYYY-MM-DD')}&end=${dayjs(
        end,
      ).format('YYYY-MM-DD')}`,
    );
  };

  return <Select {...props} onChange={handleChange} />;
};

export default StatsYearSelect;
