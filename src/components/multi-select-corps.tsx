'use client';

import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';

type OptionType = {
  label: string;
  value: string;
};

type MultiSelectCorpsProps = {
  options: OptionType[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  label?: string;
  placeholder?: string;
};

const MultiSelectCorps = ({
  options,
  value,
  defaultValue: defaultValueProp,
  onChange,
  className = '',
  placeholder,
}: MultiSelectCorpsProps) => {
  const [selected, setSelected] = useState<MultiValue<OptionType>>([]);
  const handleChange = (selectedOptions: MultiValue<OptionType>) => {
    setSelected(selectedOptions);
    onChange?.(selectedOptions.map((o) => o.value));
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
      className={className}
      isMulti
      isSearchable
      options={options}
      value={selected}
      defaultValue={defaultValue}
      noOptionsMessage={() => 'Inga corps hittades'}
      onChange={handleChange}
      placeholder={placeholder}
      unstyled
      classNames={{}}
    />
  );
};

export default MultiSelectCorps;
