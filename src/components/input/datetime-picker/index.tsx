'use client';

import { IconCalendar, IconX } from '@tabler/icons-react';
import Popover from 'components/popover';
import dayjs from 'dayjs';
import { useState } from 'react';
import ActionIcon from '../action-icon';
import DatePickerDropdown from '../date-picker/dropdown';
import TimePickerDropdown from './time-picker-dropdown';

type DateTimePickerProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  withAsterisk?: boolean;
  placeholder?: string;
  defaultValue?: Date;
  clearable?: boolean;
};

const DateTimePicker = ({
  value,
  onChange,
  label,
  withAsterisk,
  placeholder,
  defaultValue,
  clearable = false,
}: DateTimePickerProps) => {
  const [date, setDate] = useState<Date | null>(defaultValue ?? null);

  const handleDateChange = (d: Date) => {
    const newDate = date
      ? new Date(date)
      : (defaultValue ?? new Date(0, 0, 0, 0, 0, 0, 0));
    newDate.setFullYear(d.getFullYear());
    newDate.setMonth(d.getMonth());
    newDate.setDate(d.getDate());
    setDate(newDate);
    onChange?.(newDate);
  };

  const handleTimeChange = (d: Date) => {
    const now = new Date();
    const newDate = date
      ? new Date(date)
      : (defaultValue ??
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    newDate.setHours(d.getHours());
    newDate.setMinutes(d.getMinutes());
    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <Popover
      position='bottom-right'
      target={
        <div className='relative mt-2 flex h-10 rounded border shadow-sm dark:border-neutral-800'>
          <input
            className='absolute size-full grow cursor-pointer rounded bg-transparent px-3 pb-1 pt-3 text-left'
            type='text'
            value={value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''}
            placeholder={placeholder}
            readOnly
          />
          {label && (
            <label className='absolute flex -translate-y-2.5 translate-x-2 items-center justify-between bg-white px-1 text-sm text-neutral-500 dark:bg-darkBg dark:text-neutral-500'>
              <div className='flex gap-1'>
                {label}
                {withAsterisk && (
                  <span className='text-base text-red-600'>*</span>
                )}
              </div>
            </label>
          )}
          {clearable && value && (
            <div className='absolute right-10 flex h-10 items-center justify-center'>
              <ActionIcon
                variant='subtle'
                onClick={() => {
                  onChange?.(null);
                  setDate(null);
                }}
              >
                <IconX />
              </ActionIcon>
            </div>
          )}
          <div className='absolute right-0 flex size-10 items-center justify-center text-red-600'>
            <IconCalendar />
          </div>
        </div>
      }
    >
      <div className='flex gap-2'>
        <DatePickerDropdown
          onDateChange={handleDateChange}
          defaultDate={defaultValue}
        />
        <TimePickerDropdown
          onChange={handleTimeChange}
          defaultTime={defaultValue}
        />
      </div>
    </Popover>
  );
};

export default DateTimePicker;
