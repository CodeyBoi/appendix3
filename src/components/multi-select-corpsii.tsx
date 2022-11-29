import { MultiSelect, MultiSelectProps } from "@mantine/core";
import React, { useMemo } from "react";
import { trpc } from "../utils/trpc";

type MultiSelectCorpsProps = Omit<MultiSelectProps, "data"> & { excludeSelf?: boolean };

const MultiSelectCorps = (props: MultiSelectCorpsProps) => {
  const { data: corpsii, status: corpsiiStatus } =
    trpc.corps.getMany.useQuery({
      excludeSelf: props.excludeSelf,
    });

  // TODO: Fetch multiple corps if `defaultValue` is set

  const corpsiiData = useMemo(() => {
    return corpsii?.map((c) => ({
      label: (c.number ? '#' + c.number : 'p.e.') + ' ' + c.name,
      value: c.id,
    })) ?? [];
  }, [corpsii]);

  const nothingFound = corpsiiStatus === 'loading' ? 'Laddar corps...' : 'Inga corps hittades';

  const multiSelectProps: MultiSelectProps = {
    ...props,
    searchable: true,
    clearable: true,
    data: corpsiiData,
    placeholder: corpsiiStatus === 'loading' ? 'Laddar corps...' : props.placeholder ?? 'Välj corps...',
    nothingFound,
  };

  return <MultiSelect {...multiSelectProps} />;
}

export default MultiSelectCorps;
