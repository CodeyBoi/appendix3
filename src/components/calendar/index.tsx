import ParamsSelect from 'components/input/params-select';
import React from 'react';

export type CalendarItem = {
  title: string;
  start: Date;
  end: Date;
};

type CalendarProps = {
  items: CalendarItem[];
  searchParams: { year: string; month: string };
};

const startYear = 2023;
const endYear = new Date().getFullYear() + 1;
const years = Array.from({ length: endYear - startYear }, (_, i) => ({
  label: (startYear + i).toString(),
  value: (startYear + i).toString(),
}));

const Calendar = ({ items, searchParams }: CalendarProps) => {
  const year = parseInt(searchParams.year);
  const month = parseInt(searchParams.month);
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return (
    <div className='flex max-w-3xl flex-col gap-2 rounded border p-2 shadow-sm dark:border-neutral-800'>
      <div className='flex justify-end gap-2 p-2'>
        <ParamsSelect
          label='Månad'
          paramName='month'
          options={[
            { label: 'Januari', value: '0' },
            { label: 'Februari', value: '1' },
            { label: 'Mars', value: '2' },
            { label: 'April', value: '3' },
            { label: 'Maj', value: '4' },
            { label: 'Juni', value: '5' },
            { label: 'Juli', value: '6' },
            { label: 'Augusti', value: '7' },
            { label: 'September', value: '8' },
            { label: 'Oktober', value: '9' },
            { label: 'November', value: '10' },
            { label: 'December', value: '11' },
          ]}
        />
        <ParamsSelect label='År' paramName='year' options={years} />
      </div>
      <div className='grid grid-cols-7 divide-x divide-y divide-solid'>
        <div className='text-center'>Mån</div>
        <div className='text-center'>Tis</div>
        <div className='text-center'>Ons</div>
        <div className='text-center'>Tor</div>
        <div className='text-center'>Fre</div>
        <div className='text-center'>Lör</div>
        <div className='text-center'>Sön</div>
        {Array.from({ length: lastDay.getDate() }, (_, i) => i + 1).map(
          (day) => {},
        )}
      </div>
    </div>
  );
};

export default Calendar;
