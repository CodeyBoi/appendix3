import React, { ReactNode } from 'react';
import StatsYearSelect from './year-select';
import { getOperatingYear } from 'utils/date';
import { lang } from 'utils/language';
import ParamsSwitch from 'components/input/params-switch';
import Restricted from 'components/restricted';

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
      <h2>{lang('Statistik', 'Statistics')}</h2>
      <div className='flex items-center gap-4'>
        <div className='w-36'>
          <StatsYearSelect
            options={yearData}
            label={lang('Verksamhetsår', 'Operating year')}
          />
        </div>
        <Restricted permissions={'manageCorps'}>
          <ParamsSwitch
            paramName='showBoner'
            label={lang('Visa fjångstatistik', 'Show fjång stats')}
          />
        </Restricted>
      </div>
      {children}
    </div>
  );
};

export default StatsLayout;
