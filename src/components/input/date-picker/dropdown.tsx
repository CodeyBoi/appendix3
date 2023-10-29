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
    <div className='z-20 flex w-60 flex-col rounded border border-solid bg-white p-2 dark:border-neutral-800 dark:bg-darkBg'>
      <div className='flex items-center'>
        <h4 className='grow select-none whitespace-nowrap text-red-600 first-letter:capitalize'>{`${monthName} ${date.year()}`}</h4>
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
            className='select-none text-center text-red-600'
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
                className='rounded-full text-center text-neutral-500 hover:bg-red-600/10'
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
