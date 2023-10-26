'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import Select, { SelectProps } from './select';

type SelectParamsProps = SelectProps & {
  paramName: string;
};

const SelectParams = ({
  paramName,
  defaultValue,
  ...props
}: SelectParamsProps) => {
  const [value, setValue] = useSearchParamsState(
    paramName,
    defaultValue?.toString(),
  );
  return <Select {...props} value={value} onChange={(v) => setValue(v)} />;
};

export default SelectParams;
