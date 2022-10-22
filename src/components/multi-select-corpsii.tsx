import { MultiSelect, MultiSelectProps, SelectItem } from "@mantine/core";
import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Corps } from "../src/types/common/main";
import { fetchCorps } from "../src/utils/fetches";
import { formatCorps } from "../src/utils/format-corps";

export interface CorpsSelectData extends Corps {
  value: string;
  label: string;
}

const MultiSelectCorpsii = (props: Omit<MultiSelectProps, "data">) => {
  const { data: userCorps } = useQuery<Corps>(["corps"], fetchCorps);

  const { data: corpsii, status: corpsiiStatus } = useQuery<(string | SelectItem)[]>([`selectCorpsii`], async () => {
    const res = await axios.get<Corps[]>('/api/corps');
    let corpsiiData: (string | SelectItem)[] = [];
    for (let i = 0; i < res.data.length; i++) {
      const corps = res.data[i];
      if (userCorps?.id !== corps.id) {
        corpsiiData.push({
          value: corps.id.toString(),
          label: formatCorps(corps),
        });
      }
    }
    return corpsiiData;
  }, { enabled: !!userCorps?.id, staleTime: Infinity });

  const selectProps: MultiSelectProps = {
    ...props,
    searchable: true,
    clearable: true,
    data: corpsii ?? [],
    placeholder: corpsiiStatus === 'loading' ? 'Laddar corps...' : props.placeholder,
    nothingFound: "Inga corps hittades",
  };

  return <MultiSelect {...selectProps} />;
}

export default MultiSelectCorpsii;