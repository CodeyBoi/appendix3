'use client';

import { ReactNode, SelectHTMLAttributes, useEffect, useState } from 'react';
import TextInput from './text-input';
import useKeyDown from 'hooks/use-key-down';

export type SelectSearchItem = {
  label: string;
  value: string;
  element?: ReactNode;
};

export type SelectSearchProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'defaultValue' | 'value'
> & {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ((value: string) => void) | (() => void);
  options: SelectSearchItem[];
  error?: string;
  className?: string;
  icon?: ReactNode;
  filter?: (item: SelectSearchItem, search?: string) => boolean;
  nothingFound?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const defaultFilter = (item: SelectSearchItem, search?: string) => {
  if (!search) {
    return true;
  }
  const lowerSearch = search.toLowerCase();
  return (
    item.label.toLowerCase().includes(lowerSearch) ||
    item.value.toLowerCase().includes(lowerSearch)
  );
};

function SelectSearch(props: SelectSearchProps) {
  const {
    label,
    value: valueProp,
    defaultValue,
    onChange,
    options,
    error,
    className = '',
    icon,
    filter = defaultFilter,
    nothingFound,
    searchValue,
    onSearchChange,
  } = props;
  const [search, setSearch] = useState('');
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<number | undefined>(undefined);

  if (valueProp && defaultValue) {
    console.warn(
      'SelectSearch: You should not set both `value` and `defaultValue`',
    );
  }

  if (!value) {
    console.log({ options, valueProp, defaultValue });
    if (valueProp && !defaultValue) {
      setValue(valueProp);
      const searchValue =
        options.find((o) => o.value === valueProp)?.label ?? '';
      setSearch(searchValue);
      onSearchChange?.(searchValue);
    } else if (defaultValue) {
      setValue(defaultValue);
      const searchValue =
        options.find((o) => o.value === defaultValue)?.label ?? '';
      setSearch(searchValue);
      onSearchChange?.(searchValue);
    }
  }

  useEffect(() => {
    if (valueProp) {
      setValue(valueProp);
    }
  }, [valueProp]);

  if (searchValue && !search) {
    setSearch(searchValue);
    onSearchChange?.(searchValue);
  }

  useEffect(() => {
    if (searchValue) {
      setSearch(searchValue);
      onSearchChange?.(searchValue);
    }
  }, [searchValue, onSearchChange]);

  useKeyDown('ArrowDown', () => {
    if (focused) {
      setSelected((prev) =>
        prev !== undefined ? (prev + 1) % options.length : 0,
      );
    }
  });

  useKeyDown('ArrowUp', () => {
    if (focused) {
      setSelected((prev) =>
        prev !== undefined ? (prev - 1) % options.length : options.length - 1,
      );
    }
  });

  useKeyDown('Enter', () => {
    if (focused && selected !== undefined) {
      const option = options[selected];
      if (option) {
        handleChange(option);
      }
    }
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setFocused(true);
    onSearchChange?.(value);
  };

  const handleChange = (v: SelectSearchItem) => {
    setValue(v.value);
    onChange?.(v.value);
    setFocused(false);
    setSelected(undefined);
    handleSearchChange(v.label);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    e.target.select();
  };

  const toOption = (item: SelectSearchItem, i: number) => {
    return filter(item, search) ? (
      <button
        type='button'
        className={
          'px-2 py-0.5 text-left hover:bg-red-600/10 dark:hover:bg-red-400/10 font-display' +
          (selected === i ? ' bg-red-600/10 dark:bg-red-400/10' : '')
        }
        key={item.value}
        onClick={() => handleChange(item)}
      >
        {item.element ?? item.label}
      </button>
    ) : (
      []
    );
  };

  const optionElements = options.flatMap(toOption);

  return (
    <div className={`flex flex-col ${className}`}>
      <TextInput
        label={label}
        icon={icon}
        value={search}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setFocused(false), 100)}
      />
      <div className='relative'>
        <div
          className={`absolute z-20 flex flex-col overflow-y-auto bg-white border border-solid dark:border-neutral-700 rounded-b max-w-max max-h-96 dark:bg-darkBg ${
            focused ? '' : 'hidden'
          }`}
        >
          {optionElements.length > 0 ? (
            optionElements
          ) : (
            <div className='p-2'>{nothingFound ?? 'Inget hittades'}</div>
          )}
        </div>
        {/* <select
          value={value}
          onChange={(e) => handleChange(e.currentTarget.value)}
          disabled={disabled}
          className={`z-20 font-display w-full px-4 py-2 pr-8 text-base text-gray-700 bg-white border hidden border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            error ? 'border-red-500' : ''
          } ${focused ? '' : ''}`}
        >
          {optionElements.length > 0 ? (
            optionElements
          ) : (
            <option value='' disabled>
              {nothingFound ?? 'Inget hittades'}
            </option>
          )}
        </select> */}
      </div>
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
}

export default SelectSearch;
