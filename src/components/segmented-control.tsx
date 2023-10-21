'use client';

import { useState } from 'react';

type Color = 'red' | 'gray';
type SegmentedControlOption = {
  label: string;
  value: string | number;
};
type SegmentedControlProps = {
  color?: Color;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  options: SegmentedControlOption[];
  disabled?: boolean;
};

const colorVariants = {
  gray: {
    selected: 'bg-red-600 text-white',
    notSelected: 'bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white',
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
  return (
    <div className={`flex divide-x rounded basis-0 divide-gray-300/20`}>
      {props.options.map((option, i) => {
        const selected = option.value === value;
        const cns = [];
        if (selected) {
          cns.push(classes.selected);
        } else {
          cns.push(classes.notSelected);
        }
        if (props.disabled) {
          cns.push('opacity-50 pointer-events-none');
        }
        if (i === 0) {
          cns.push('rounded-l');
        }
        if (i === props.options.length - 1) {
          cns.push('rounded-r');
        }
        return (
          <button
            key={option.value}
            className={
              'px-4 py-2 h-min flex-1 font-display text-center transition-colors ' +
              cns.join(' ')
            }
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
