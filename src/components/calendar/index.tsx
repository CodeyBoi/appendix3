import ParamsSelect from 'components/input/params-select';
import React from 'react';
import { genCalender } from 'utils/date';
import CalendarDay from './day';
import Button from 'components/input/button';
import { IconPlus } from '@tabler/icons-react';

export type CalendarItem = {
  title: string;
  start: Date;
  end: Date;
};

type CalendarProps = {
  items: CalendarItem[];
  year: number;
  month: number;
};

const startYear = 2023;
const endYear = new Date().getFullYear() + 1;
const years = Array.from({ length: endYear - startYear }, (_, i) => ({
  label: (startYear + i).toString(),
  value: (startYear + i).toString(),
}));

const months = [
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
];

const Calendar = ({ items, year, month }: CalendarProps) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const monthItems = items.filter(
    (item) =>
      item.start.getTime() <= lastDay.getTime() + 86400000 &&
      item.end.getTime() >= firstDay.getTime(),
  );
  return (
    <div className='flex max-w-3xl flex-col gap-2 rounded border p-2 shadow-sm dark:border-neutral-800'>
      <div className='flex items-center justify-between p-2'>
        <Button href='/bookings/new'>
          <IconPlus />
          Ny bokning
        </Button>
        <div className='flex gap-2'>
          <ParamsSelect
            label='Månad'
            paramName='month'
            options={months}
            defaultValue={month.toString()}
          />
          <ParamsSelect
            label='År'
            paramName='year'
            options={years}
            defaultValue={year.toString()}
          />
        </div>
      </div>
      <div className='grid grid-cols-7 divide-x divide-y divide-solid'>
        <div className='text-center'>Mån</div>
        <div className='text-center'>Tis</div>
        <div className='text-center'>Ons</div>
        <div className='text-center'>Tor</div>
        <div className='text-center'>Fre</div>
        <div className='text-center'>Lör</div>
        <div className='text-center'>Sön</div>
        {genCalender(year, month).flatMap((week, i) =>
          week.flatMap((day, j) => {
            if (day === null) {
              return <div key={`${i}-${j}`} />;
            }
            const date = new Date(year, month, day);
            return (
              <CalendarDay key={`${i}-${j}`} date={date} items={monthItems} />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Calendar;
