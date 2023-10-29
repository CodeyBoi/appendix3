import React, { ReactNode } from 'react';
import StatsYearSelect from './year-select';
import { getOperatingYear } from 'utils/date';

const startOperatingYear = 2010;
const operatingYears = Array.from(
  { length: getOperatingYear() - startOperatingYear + 1 },
  (_, i) => startOperatingYear + i,
).reverse();

const StatsLayout = ({ children }: { children: ReactNode }) => {
  const yearData =
    operatingYears?.map((y) => ({
      label: `${y}-${y + 1}`,
      value: y,
    })) ?? [];

  return (
    <div className='flex max-w-max flex-col gap-2'>
      <h2>Statistik</h2>
      <div className='w-36'>
        <StatsYearSelect options={yearData} label='Verksamhetsår' />
      </div>
      {children}
    </div>
  );
};

export default StatsLayout;
