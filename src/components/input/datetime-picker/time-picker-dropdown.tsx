import ActionIcon from '../action-icon';
import { useState } from 'react';

type TimePickerDropdownProps = {
  onChange?: (date: Date) => void;
  initialHour?: number;
  initialMinute?: number;
};

const TimePickerDropdown = (props: TimePickerDropdownProps) => {
  const { onChange } = props;
  const [hour, setHour] = useState(props.initialHour ?? 0);
  const [minute, setMinute] = useState(props.initialMinute ?? 0);
  return (
    <div className='flex rounded bg-white p-2 dark:bg-darkBg'>
      <div className='flex max-h-60 flex-col overflow-y-auto no-scrollbar'>
        {Array.from({ length: 24 }).map((_, i) => {
          const h = i.toString().padStart(2, '0');
          return (
            <div key={h} className='flex items-center'>
              <ActionIcon
                variant='subtle'
                onClick={() => {
                  const newDate = new Date(i, minute);
                  onChange?.(newDate);
                  setHour(i);
                }}
              >
                <h4 className='select-none whitespace-nowrap'>{h}</h4>
              </ActionIcon>
            </div>
          );
        })}
        <div className='flex max-h-60 flex-col overflow-y-auto no-scrollbar'>
          {Array.from({ length: 12 }).map((_, i) => {
            const m = (i * 5).toString().padStart(2, '0');
            return (
              <div key={m} className='flex items-center'>
                <ActionIcon
                  variant='subtle'
                  onClick={() => {
                    const newDate = new Date(hour, i * 5);
                    onChange?.(newDate);
                    setMinute(i * 5);
                  }}
                >
                  <h4 className='select-none whitespace-nowrap'>{m}</h4>
                </ActionIcon>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimePickerDropdown;
