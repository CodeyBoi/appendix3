'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import ActionIcon from 'components/input/action-icon';
import { cn } from 'utils/class-names';
import Select from '../select';
import { range } from 'utils/array';
import { getOperatingYear } from 'utils/date';

const genCalender = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const daysInMonth = dayjs(date).daysInMonth();
  // Shift the first day by 6 because monday is the first day of the week (instead of sunday)
  const firstDay = (date.getDay() + 6) % 7;
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

const years = range(1970, getOperatingYear() + 2)
  .reverse()
  .map((y) => ({ value: y, label: y.toString() }));

type DatePickerDropdownProps = {
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
};

const DatePickerDropdown = ({
  defaultDate,
  onDateChange,
}: DatePickerDropdownProps) => {
  const initialDate = defaultDate ?? new Date();
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [date, setDate] = useState(
    dayjs(
      new Date(
        initialDate.getFullYear(),
        initialDate.getMonth(),
        initialDate.getDate(),
      ),
    ),
  );
  const monthName = new Date(year, month, 1).toLocaleDateString('sv-SE', {
    month: 'long',
  });

  const increaseMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const decreaseMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div className='flex w-60 flex-col gap-2 rounded bg-white p-2 dark:bg-darkBg'>
      <div className='flex gap-1'>
        <div className='flex grow items-baseline gap-2'>
          <h4 className='select-none whitespace-nowrap text-red-600 first-letter:capitalize'>{`${monthName}`}</h4>
          <Select
            options={years}
            value={year}
            onChange={(y) => setYear(parseInt(y))}
          />
        </div>
        <ActionIcon variant='subtle' onClick={decreaseMonth}>
          <IconChevronLeft />
        </ActionIcon>
        <ActionIcon variant='subtle' onClick={increaseMonth}>
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
        {genCalender(year, month).map((week, i) =>
          week.map((day, j) => {
            return day === null ? (
              <span key={`${i}-${j}`} />
            ) : (
              <button
                key={`${i}-${j}`}
                type='button'
                className={cn(
                  'rounded-full text-center text-neutral-500',
                  date.date() === day &&
                    date.year() === year &&
                    date.month() === month
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-red-600/10',
                )}
                onClick={() => {
                  if (day) {
                    const newDate = date.year(year).month(month).date(day);
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
