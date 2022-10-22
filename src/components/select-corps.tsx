import { Select, SelectItem, SelectProps } from "@mantine/core";
import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Corps } from "../src/types/common/main";
import { fetchCorps } from "../src/utils/fetches";

export interface CorpsSelectData extends Corps {
  value: string;
  label: string;
}

const SelectCorps = (props: Omit<SelectProps, "data">) => {
  const { data: userCorps } = useQuery<Corps>(["corps"], fetchCorps);

  const { data: corpsii, status: corpsiiStatus } = useQuery<(string | SelectItem)[]>([`selectCorpsii`], async () => {
    const res = await axios.get<Corps[]>('/api/corps');
    let corpsiiData: (string | SelectItem)[] = [];
    for (let i = 0; i < res.data.length; i++) {
      const corps = res.data[i];
      if (userCorps?.id !== corps.id) {
        corpsiiData.push({
          value: corps.id.toString(),
          label: `${corps.number ? '#' + corps.number : 'p.e.'} ${corps.firstName} ${corps.lastName}`,
        });
      }
    }
    return corpsiiData;
  }, { enabled: !!userCorps?.id, staleTime: Infinity });

  const selectProps: SelectProps = {
    ...props,
    searchable: true,
    clearable: true,
    data: corpsii ?? [],
    placeholder: corpsiiStatus === 'loading' ? 'Laddar corps...' : props.placeholder,
    nothingFound: "Inga corps hittades",
  };

  return <Select {...selectProps} />;
}

export default SelectCorps;