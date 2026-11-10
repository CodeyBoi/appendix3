'use client';

import React from 'react';
import dayjs from 'dayjs';
import CalendarControl from './control';
import { cn } from 'utils/class-names';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { lang } from 'utils/language';
import { Language } from 'hooks/use-language';
import { api } from 'trpc/react';
import LoadingOverlay from 'components/form-loading-overlay';
dayjs.extend(weekOfYear);

export type CalendarItem = {
  title: string;
  start: Date;
  end: Date;
  approved: boolean | null;
};

type CalendarProps = {
  start: Date;
};

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}:00`,
  value: i,
}));

const getDayName = (date: Date, locale: Language) =>
  date.toLocaleDateString(locale, { weekday: 'long' });

const Calendar = ({ start }: CalendarProps) => {
  const firstDay = dayjs(start);
  const lastDay = firstDay.add(1, 'week');

  const { data: items, isFetching } = api.booking.getMany.useQuery({
    start: firstDay.toDate(),
    end: lastDay.toDate(),
  });

  console.log(items);

  const weekItems = items?.filter(
    (item) =>
      (item.start.getTime() <= lastDay.toDate().getTime() &&
        item.start.getTime() >= firstDay.toDate().getTime()) ||
      (item.end.getTime() <= lastDay.toDate().getTime() &&
        item.end.getTime() >= firstDay.toDate().getTime()),
  );
  return (
    <div className='flex max-w-3xl flex-col gap-2 rounded border p-2 shadow-sm dark:border-neutral-800'>
      <CalendarControl />
      <LoadingOverlay visible={isFetching}>
        <div className='grid grid-cols-8 divide-x divide-y divide-solid'>
          <div className='pr-1 text-right'>{firstDay.format('MMM')}</div>
          {Array.from({ length: 7 }, (_, i) => {
            const day = firstDay.add(i, 'days');
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'text-center first-letter:capitalize',
                  (day.day() === 0 || day.day() === 6) && 'text-red-600',
                )}
              >
                {lang(
                  getDayName(day.toDate(), 'sv').slice(0, 3),
                  getDayName(day.toDate(), 'en').slice(0, 3),
                )}
              </div>
            );
          })}
          <div className='pr-1 text-right'>{`v. ${firstDay.week()}`}</div>
          {Array.from({ length: 7 }, (_, i) => {
            const date = firstDay.add(i, 'day');
            return (
              <div
                key={date.toISOString()}
                className={cn('text-center', i >= 5 && 'text-red-600')}
              >
                {date.format('D')}
              </div>
            );
          })}
          {hours.map((hour) => (
            <React.Fragment key={`${start.toISOString()}-${hour.value}`}>
              <div className='p-1 text-right text-xs font-light text-gray-500'>
                {hour.label}
              </div>
              {Array.from({ length: 7 }, (_, i) => {
                const currentHour = firstDay
                  .add(i, 'day')
                  .add(hour.value, 'hour');
                const item = weekItems?.find(
                  (item) =>
                    item.start.getTime() <= currentHour.toDate().getTime() &&
                    item.end.getTime() > currentHour.toDate().getTime(),
                );
                const hasEvent = item !== undefined;
                const itemBgColor = !hasEvent
                  ? ''
                  : item.approved === true
                  ? 'bg-red-600'
                  : item.approved === null
                  ? 'bg-yellow'
                  : '';
                return (
                  <div
                    key={`${currentHour.toISOString()}-${item?.id}`}
                    className={cn('p-1 text-xs font-thin', itemBgColor)}
                  >
                    {hasEvent ? item.title : ''}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </LoadingOverlay>
    </div>
  );
};

export default Calendar;
