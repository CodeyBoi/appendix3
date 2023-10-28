'use client';

import Popover from 'components/popover';
import DatePickerDropdown from './dropdown';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { IconCalendar } from '@tabler/icons-react';

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  withAsterisk?: boolean;
  placeholder?: string;
};

const DatePicker = ({
  value,
  onChange,
  label,
  withAsterisk = false,
  placeholder,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [popoverOpened, setPopoverOpened] = useState(false);

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  useEffect(() => {
    if (date) {
      onChange?.(date);
    }
  }, [date]);

  const getDateString = (date: Date | null) => {
    if (!date) {
      return '';
    }
    return dayjs(date).format('YYYY-MM-DD');
  };

  return (
    <div className='relative flex h-10 mt-2 border rounded shadow-sm dark:border-neutral-800'>
      <input
        className='absolute flex-grow w-full h-full px-3 pt-3 pb-1 text-left bg-transparent'
        type='text'
        value={getDateString(date)}
        placeholder={placeholder}
        readOnly
      />
      {label && (
        <label className='absolute flex items-center justify-between px-1 text-sm translate-x-2 -translate-y-2.5 bg-white text-neutral-500 dark:text-neutral-500 dark:bg-darkBg'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-base text-red-600'>*</span>}
          </div>
        </label>
      )}
      <div className='absolute right-0 flex items-center justify-center w-10 h-10'>
        <Popover
          opened={popoverOpened}
          closeOnBlur={false}
          position='left-bottom'
          target={<IconCalendar />}
          onChange={setPopoverOpened}
          popover={
            <DatePickerDropdown
              onDateChange={(date) => {
                setDate(date);
                console.log({ date, popoverOpened });
                setPopoverOpened(false);
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default DatePicker;
