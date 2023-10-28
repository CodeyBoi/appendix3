'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import ActionIcon from 'components/input/action-icon';

const genCalender = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const daysInMonth = dayjs(date).daysInMonth();
  const firstDay = date.getDay();
  const weeks = [];
  let week = [];
  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    week.push(i);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    weeks.push(week);
  }
  return weeks;
};

type DatePickerDropdownProps = {
  initialMonth?: number;
  initialYear?: number;
  onDateChange?: (date: Date) => void;
};

const DatePickerDropdown = ({
  initialMonth,
  initialYear,
  onDateChange,
}: DatePickerDropdownProps) => {
  const currentDate = new Date();
  const year = initialYear ?? currentDate.getFullYear();
  const month = initialMonth ?? currentDate.getMonth();
  const [date, setDate] = useState(dayjs(new Date(year, month, 1)));
  const monthName = date
    .toDate()
    .toLocaleDateString('sv-SE', { month: 'long' });
  return (
    <div className='z-20 flex flex-col p-2 bg-white border border-solid rounded w-60 dark:bg-darkBg dark:border-neutral-800'>
      <div className='flex items-center'>
        <h4 className='flex-grow text-red-600 select-none first-letter:capitalize whitespace-nowrap'>{`${monthName} ${date.year()}`}</h4>
        <ActionIcon
          variant='subtle'
          onClick={() => {
            setDate(date.subtract(1, 'month'));
          }}
        >
          <IconChevronLeft />
        </ActionIcon>
        <ActionIcon
          variant='subtle'
          onClick={() => {
            setDate(date.add(1, 'month'));
          }}
        >
          <IconChevronRight />
        </ActionIcon>
      </div>
      <div className='grid grid-cols-7 gap-2'>
        {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map((day, i) => (
          <span
            key={`${day}-${i}`}
            className='text-center text-red-600 select-none'
          >
            {day}
          </span>
        ))}
        {genCalender(date.year(), date.month()).map((week, i) =>
          week.map((day, j) => {
            return day === null ? (
              <span key={`${i}-${j}`} />
            ) : (
              <button
                key={`${i}-${j}`}
                type='button'
                className='text-center rounded-full text-neutral-500 hover:bg-red-600/10'
                onClick={() => {
                  if (day) {
                    const newDate = date.date(day);
                    setDate(newDate);
                    onDateChange?.(newDate.toDate());
                  }
                }}
              >
                {day}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default DatePickerDropdown;
