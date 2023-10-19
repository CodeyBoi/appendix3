import { Select, SelectProps } from '@mantine/core';
import React, { useMemo } from 'react';
import { trpc } from '../utils/trpc';

const MIN_SEARCH_LENGTH = 2;

type SelectCorpsProps = Omit<SelectProps, 'data'> & { excludeSelf?: boolean };

const SelectCorps = (props: SelectCorpsProps) => {
  const [queryValue, setQueryValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');

  const { data: corpsii, status: corpsiiStatus } = trpc.corps.getMany.useQuery(
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
      id: props.defaultValue as string,
    },
    {
      enabled: !!props.defaultValue,
    },
  );

  const corpsiiData = useMemo(() => {
    const data = initialCorps
      ? [
          {
            label: `${
              initialCorps.number ? '#' + initialCorps.number : 'p.e.'
            } ${initialCorps.displayName}`,
            value: initialCorps.id,
          },
        ]
      : [];
    if (corpsii) {
      return data.concat(
        corpsii
          .filter((c) => !initialCorps || initialCorps.id !== c.id)
          .map((c) => ({
            label: (c.number ? '#' + c.number : 'p.e.') + ' ' + c.displayName,
            value: c.id,
          })),
      );
    }
    return data;
  }, [corpsii, initialCorps]);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length >= MIN_SEARCH_LENGTH) {
      setQueryValue(value);
    }
  };

  const nothingFound =
    corpsiiStatus === 'loading' ? 'Laddar corps...' : 'Inga corps hittades';

  const selectProps: SelectProps = {
    ...props,
    searchable: true,
    clearable: true,
    data: corpsiiData ?? [],
    placeholder:
      queryValue.length >= MIN_SEARCH_LENGTH && corpsiiStatus === 'loading'
        ? 'Laddar corps...'
        : props.placeholder,
    nothingFound:
      searchValue.length < MIN_SEARCH_LENGTH
        ? 'Skriv minst två tecken för att söka...'
        : nothingFound,
    searchValue,
    onSearchChange,
  };

  return <Select zIndex={516} {...selectProps} />;
};

export default SelectCorps;
