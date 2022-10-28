import { MultiSelect, MultiSelectProps } from "@mantine/core";
import React, { useMemo } from "react";
import { trpc } from "../utils/trpc";

const MultiSelectCorpsii = (props: Omit<MultiSelectProps, "data">) => {

  const { data: corps } = trpc.corps.getCorps.useQuery();
  const { data: corpsii, status: corpsiiStatus } =
    trpc.corps.getCorpsii.useQuery(undefined, {
      enabled: !!corps,
      staleTime: 1000 * 60 * 60 * 24
    });

  const corpsiiData = useMemo(() => corpsii?.map(c => ({
    label: c.number ? '#' + c.number : 'p.e.' + ' ' + c.name,
    value: c.id.toString(),
  })), [corpsii]);

  const selectProps: MultiSelectProps = {
    ...props,
    searchable: true,
    clearable: true,
    data: corpsiiData ?? [],
    placeholder: corpsiiStatus === 'loading' ? 'Laddar corps...' : props.placeholder,
    nothingFound: "Inga corps hittades",
  };

  return <MultiSelect {...selectProps} />;
}

export default MultiSelectCorpsii;