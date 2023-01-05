import { MultiSelect, MultiSelectProps } from "@mantine/core";
import React, { useMemo } from "react";
import { trpc } from "../utils/trpc";

type MultiSelectCorpsProps = Omit<MultiSelectProps, "data"> & { excludeSelf?: boolean, excludeIds?: string[] };

const MultiSelectCorps = (props: MultiSelectCorpsProps) => {
  const { excludeIds, excludeSelf } = props;
  const { data: corpsii, status: corpsiiStatus } =
    trpc.corps.getMany.useQuery({ excludeSelf });

  // TODO: Fetch multiple corps if `defaultValue` is set

  const corpsiiData = useMemo(() => {
    const excludeSet = new Set(excludeIds ?? []);
    return corpsii?.filter((c) => !excludeSet.has(c.id)).map((c) => ({
      label: (c.number ? '#' + c.number : 'p.e.') + ' ' + c.name,
      value: c.id,
    })) ?? [];
  }, [corpsii, excludeIds]);

  const nothingFound = corpsiiStatus === 'loading' ? 'Laddar corps...' : 'Inga corps hittades';

  const multiSelectProps: MultiSelectProps = {
    ...{
      ...props,
      excludeSelf: undefined,
      excludeIds: undefined,
    },
    searchable: true,
    clearable: true,
    data: corpsiiData,
    placeholder: corpsiiStatus === 'loading' ? 'Laddar corps...' : props.placeholder ?? 'Välj corps...',
    nothingFound,
    limit: props.limit ?? 30,
  };

  return <MultiSelect { ...multiSelectProps } />;
}

export default MultiSelectCorps;
