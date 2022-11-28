import { Select, SelectProps } from "@mantine/core";
import React, { useMemo } from "react";
import { trpc } from "../utils/trpc";

const MIN_SEARCH_LENGTH = 2;

const SelectCorpsii = (props: Omit<SelectProps, "data">) => {
  const [queryValue, setQueryValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  const { data: corpsii, status: corpsiiStatus } =
    trpc.corps.getMany.useQuery({
      search: queryValue,
    }, {
      enabled: queryValue.length >= MIN_SEARCH_LENGTH,
      staleTime: 1000 * 60 * 60 * 24
    });

  const corpsiiData = useMemo(() => corpsii?.map(c => ({
    label: (c.number ? '#' + c.number : 'p.e.') + ' ' + c.name,
    value: c.id,
  })), [corpsii]);

  // BUG: When the user reloads the query the selected corpsii are reset
  const onSearchChange = (value: string) => {
    console.log('onSearchChange', value);
    setSearchValue(value);
    if (value.length === MIN_SEARCH_LENGTH) {
      setQueryValue(value);
    }
  };

  const nothingFound = corpsiiStatus === 'loading' ? 'Laddar corps...' : 'Inga corps hittades';

  const selectProps: SelectProps = {
    ...props,
    searchable: true,
    clearable: true,
    data: corpsiiData ?? [],
    placeholder: queryValue.length >= MIN_SEARCH_LENGTH && corpsiiStatus === 'loading' ? 'Laddar corps...' : props.placeholder,
    nothingFound: searchValue.length < MIN_SEARCH_LENGTH ? "Skriv minst två tecken för att söka..." : nothingFound,
    searchValue,
    onSearchChange,
  };

  return <Select {...selectProps} />;
}

export default SelectCorpsii;
