'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { ChangeHandler } from 'react-hook-form';
import Select, { SelectInstance, MultiValue } from 'react-select';

interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectCorpsProps {
  options: OptionType[];
  value?: string[];
  defaultValue?: string[];
  onChange?: ChangeHandler;
  className?: string;
  placeholder?: string;
}

const MultiSelect = forwardRef<
  SelectInstance<OptionType>,
  MultiSelectCorpsProps
>(
  (
    {
      options,
      value,
      defaultValue: defaultValueProp,
      onChange,
      className,
      placeholder,
    }: MultiSelectCorpsProps,
    ref,
  ) => {
    const [selected, setSelected] = useState<MultiValue<OptionType>>([]);
    const handleChange = (selectedOptions: MultiValue<OptionType>) => {
      setSelected(selectedOptions);
      onChange?.({
        target: {
          value: selectedOptions.map((o) => o.value),
        },
        type: 'change',
      });
    };

    const defaultValue = options.filter(
      (o) => defaultValueProp?.includes(o.value),
    );

    useEffect(() => {
      const selectedOptions = options.filter((o) => value?.includes(o.value));
      setSelected(selectedOptions);
    }, [options, value]);

    return (
      <Select
        ref={ref}
        className={className}
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: 'transparent',
          }),
        }}
        classNames={{
          container: () => 'shadow-sm border-gray-300 dark:border-gray-700',
        }}
        isMulti
        isSearchable
        options={options}
        value={selected}
        defaultValue={defaultValue}
        noOptionsMessage={() => 'Inga corps hittades'}
        onChange={(newValue) =>
          { handleChange(
            Array.isArray(newValue)
              ? newValue
              : newValue !== null
              ? [newValue]
              : [],
          ); }
        }
        placeholder={placeholder}
      />
    );
  },
);

export default MultiSelect;
