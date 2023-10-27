import React from 'react';
import { api } from 'trpc/server';
import MultiSelectCorps from './multi-select-corps';

type OptionType = {
  label: string;
  value: string;
};

const fetchOptions = async (): Promise<OptionType[]> => {
  const corpsii = await api.corps.getMany.query({});
  const options = corpsii.map((c) => ({
    label:
      c.firstName +
      ' ' +
      (c.nickName ? '"' + c.nickName + '" ' : '') +
      c.lastName,
    value: c.id,
  }));
  return options;
};

type MultiSelectCorpsProps = {
  defaultValue?: string[];
};

const MultiSelectCorpsFetch = async ({
  defaultValue,
}: MultiSelectCorpsProps) => {
  const options = await fetchOptions();
  return <MultiSelectCorps options={options} defaultValue={defaultValue} />;
};

export default MultiSelectCorpsFetch;
