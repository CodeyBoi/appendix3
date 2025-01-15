'use client';

import { useEffect, useState } from 'react';
import { cn } from 'utils/class-names';

type Color = 'red' | 'gray';
interface SegmentedControlOption {
  label: React.ReactNode;
  value: string | number;
}
interface SegmentedControlProps {
  color?: Color;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  options: SegmentedControlOption[];
  disabled?: boolean;
  className?: string;
}

const colorVariants = {
  gray: {
    selected: 'bg-red-600 text-white',
    notSelected:
      'bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white dark:bg-neutral-800 dark:text-gray-300',
  },
  red: {
    selected: 'bg-red-600 text-white',
    notSelected: 'bg-red-700 text-gray-300 hover:text-white',
  },
};

const SegmentedControl = (props: SegmentedControlProps) => {
  const [value, setValue] = useState(props.defaultValue ?? '');
  const color = props.color ?? 'gray';
  const classes = colorVariants[color];

  useEffect(() => {
    if (props.value === undefined) {
      return;
    }
    setValue(props.value);
  }, [props.value]);

  return (
    <div
      className={cn(
        'flex basis-0 select-none divide-x divide-gray-500/20 rounded shadow',
        props.className,
      )}
    >
      {props.options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            className={cn(
              'h-min flex-1 px-4 py-2 text-center font-display transition-colors',
              selected && classes.selected,
              selected && 'translate-y-px font-bold',
              !selected && classes.notSelected,
              props.disabled && 'pointer-events-none opacity-50',
              i === 0 && 'rounded-l',
              i === props.options.length - 1 && 'rounded-r',
            )}
            onClick={() => {
              setValue(option.value);
              props.onChange?.(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
