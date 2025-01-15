'use client';

import Popover from 'components/popover';
import DatePickerDropdown from './dropdown';
import dayjs from 'dayjs';
import { IconCalendar } from '@tabler/icons-react';
import ActionIcon from '../action-icon';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  withAsterisk?: boolean;
  placeholder?: string;
}

const DatePicker = ({
  value,
  onChange,
  label,
  withAsterisk = false,
  placeholder,
}: DatePickerProps) => {
  const getDateString = (date: Date | null) => {
    if (!date) {
      return '';
    }
    return dayjs(date).format('YYYY-MM-DD');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate;
    if (date) {
      onChange?.(date);
    }
  };

  const setDate = (date: Date) => {
    onChange?.(date);
  };

  return (
    <div className='relative mt-2 flex h-10 rounded border shadow-sm dark:border-neutral-800'>
      <input
        className='absolute h-full w-full grow rounded bg-transparent px-3 pb-1 pt-3 text-left'
        type='text'
        value={value ? getDateString(value) : undefined}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly
      />
      {label && (
        <label className='absolute flex -translate-y-2.5 translate-x-2 items-center justify-between bg-white px-1 text-sm text-neutral-500 dark:bg-darkBg dark:text-neutral-500'>
          <div className='flex gap-1'>
            {label}
            {withAsterisk && <span className='text-base text-red-600'>*</span>}
          </div>
        </label>
      )}
      <div className='absolute right-0 flex h-10 w-10 items-center justify-center'>
        <Popover
          position='left-bottom'
          target={
            <ActionIcon variant='subtle'>
              <IconCalendar />
            </ActionIcon>
          }
        >
          <DatePickerDropdown onDateChange={setDate} defaultDate={value} />
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;
