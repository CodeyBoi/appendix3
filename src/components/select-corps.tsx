import { Select, SelectProps } from '@mantine/core';
import React, { useMemo } from 'react';
import { trpc } from '../utils/trpc';

const MIN_SEARCH_LENGTH = 2;

export const formatName = (c: {
  number: number | null;
  firstName: string;
  lastName: string;
  nickName: string | null;
}) => {
  const { number, firstName, lastName, nickName } = c;
  const corpsNumber = number ? '#' + number.toString() : 'p.e.';
  const name = `${firstName.trim()}${
    nickName ? ' "' + nickName.trim() + '"' : ''
  } ${lastName.trim()}`;
  return `${corpsNumber} ${name}`;
};

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
            label: formatName(initialCorps),
            value: initialCorps.id,
          },
        ]
      : [];
    if (corpsii) {
      return data.concat(
        corpsii
          .filter((c) => !initialCorps || initialCorps.id !== c.id)
          .map((c) => ({
            label: formatName(c),
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
    filter: () => true,
    searchValue,
    onSearchChange,
  };

  return <Select zIndex={516} {...selectProps} />;
};

export default SelectCorps;
