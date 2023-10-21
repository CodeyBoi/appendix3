'use client';

import { useState } from 'react';

type SegmentedControlOption = {
  label: string;
  value: string | number;
};
type SegmentedControlProps = {
  selectedColor?: string;
  bg?: string;
  notSelectedTextColor?: string;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  options: SegmentedControlOption[];
};

const SegmentedControl = (props: SegmentedControlProps) => {
  const [value, setValue] = useState(props.defaultValue ?? '');
  const { bg = 'gray-100', notSelectedTextColor = 'gray-700' } = props;
  return (
    <div
      className={`flex text-${notSelectedTextColor} bg-${bg} divide-x rounded basis-0 divide-gray-300/20`}
    >
      {props.options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            className={`px-4 py-2 h-min flex-1 font-display text-center transition-colors hover:bg-red-600 hover:text-white ${
              selected ? 'bg-red-600 text-white' : ''
            } ${i === 0 ? 'rounded-l' : ''} ${
              i === props.options.length - 1 ? 'rounded-r' : ''
            }`}
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
