'use client';

import React, { useMemo } from 'react';
import { trpc } from 'utils/trpc';
import SelectSearch, { SelectSearchProps } from './input/search-select';
import { detailedName } from 'utils/corps';

const MIN_SEARCH_LENGTH = 2;

type SelectCorpsProps = Omit<SelectSearchProps, 'options'> & {
  excludeSelf?: boolean;
  excludeIds?: string[];
  defaultSearchValue?: string;
};

const SelectCorps = ({
  defaultValue,
  defaultSearchValue,
  excludeIds,
  filter = () => true,
  ...props
}: SelectCorpsProps) => {
  const [queryValue, setQueryValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState(
    defaultSearchValue ?? '',
  );

  const { data: corpsii, status: corpsiiStatus } = trpc.corps.search.useQuery(
    {
      search: queryValue,
      excludeSelf: props.excludeSelf,
    },
    {
      enabled: queryValue.length >= MIN_SEARCH_LENGTH,
    },
  );

  // Here we fetch a corps if `defaultValue` is set
  const { data: initialCorps } = trpc.corps.get.useQuery(
    {
      id: defaultValue ?? '',
    },
    {
      enabled: !!defaultValue,
    },
  );

  const corpsiiData = useMemo(() => {
    const data = initialCorps
      ? [
          {
            label: detailedName(initialCorps),
            value: initialCorps.id,
          },
        ]
      : [];
    if (corpsii) {
      return data.concat(
        corpsii
          .filter(
            (c) =>
              (!initialCorps || initialCorps.id !== c.id) &&
              !excludeIds?.includes(c.id),
          )
          .map((c) => ({
            label: detailedName(c),
            value: c.id,
          })),
      );
    }
    return data;
  }, [corpsii, initialCorps, excludeIds]);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length >= MIN_SEARCH_LENGTH) {
      setQueryValue(value);
    }
  };

  const nothingFound =
    corpsiiStatus === 'loading' ? 'Hämtar corps...' : 'Inga corps hittades';

  if (defaultValue && !corpsiiData.find((c) => c.value === defaultValue)) {
    return null;
  }

  const selectProps: SelectSearchProps = {
    ...props,
    options: corpsiiData,
    label: props.label ?? 'Sök...',
    placeholder:
      queryValue.length >= MIN_SEARCH_LENGTH && corpsiiStatus === 'loading'
        ? 'Hämtar corps...'
        : props.placeholder,
    nothingFound:
      searchValue.length < MIN_SEARCH_LENGTH
        ? 'Sök på namn, smeknamn, nummer eller sektion...'
        : nothingFound,
    filter,
    searchValue,
    onSearchChange,
  };

  return <SelectSearch {...selectProps} />;
};

export default SelectCorps;
