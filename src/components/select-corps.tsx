'use client';

import React, { useMemo, useState } from 'react';
import { trpc } from 'utils/trpc';
import SelectSearch, { SelectSearchProps } from './input/search-select';
import { detailedName } from 'utils/corps';

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
  const [searchValue, setSearchValue] = useState(defaultSearchValue ?? '');

  const { data: corpsii, status: corpsiiStatus } = trpc.corps.search.useQuery({
    search: searchValue,
    excludeSelf: props.excludeSelf,
    take: 20,
  });

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
      corpsiiStatus === 'loading' ? 'Hämtar corps...' : props.placeholder,
    nothingFound,
    filter,
    searchValue,
    onSearchChange: setSearchValue,
  };

  return <SelectSearch {...selectProps} />;
};

export default SelectCorps;
