import { cn } from 'utils/class-names';
import { useState } from 'react';

type TimePickerDropdownProps = {
  defaultTime?: Date;
  onChange?: (date: Date) => void;
};

const TimePickerDropdown = (props: TimePickerDropdownProps) => {
  const { onChange } = props;
  const [hour, setHour] = useState(props.defaultTime?.getHours() ?? 0);
  const [minute, setMinute] = useState(props.defaultTime?.getMinutes() ?? 0);
  return (
    <div className='flex gap-1 rounded bg-white p-2 dark:bg-darkBg'>
      <div className='flex max-h-72 flex-col overflow-y-auto no-scrollbar'>
        {Array.from({ length: 24 }).map((_, i) => {
          const h = i.toString().padStart(2, '0');
          return (
            <div
              key={h + 'h'}
              className={cn(
                'flex w-8 cursor-pointer justify-center rounded',
                i === hour
                  ? 'bg-red-600 text-white'
                  : 'text-red-600 hover:bg-red-600/5',
              )}
              onClick={(e) => {
                const date = new Date(0, 0, 0, i, minute, 0, 0);
                onChange?.(date);
                setHour(i);
                e.currentTarget.scrollIntoView();
              }}
            >
              <h4 className='select-none whitespace-nowrap'>{h}</h4>
            </div>
          );
        })}
      </div>
      <div className='flex max-h-72 flex-col overflow-y-auto no-scrollbar'>
        {Array.from({ length: 12 }).map((_, i) => {
          const m = i * 5;
          const mString = m.toString().padStart(2, '0');
          return (
            <div
              key={mString + 'm'}
              className={cn(
                'flex w-8 cursor-pointer justify-center rounded',
                m === minute
                  ? 'bg-red-600 text-white'
                  : 'text-red-600 hover:bg-red-600/5',
              )}
              onClick={(e) => {
                const date = new Date(0, 0, 0, hour, m, 0, 0);
                onChange?.(date);
                setMinute(m);
                e.currentTarget.scrollIntoView();
              }}
            >
              <h4 className='select-none whitespace-nowrap'>{mString}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimePickerDropdown;
