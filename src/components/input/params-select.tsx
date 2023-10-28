'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import Select, { SelectProps } from './select';

type ParamsSelectProps = SelectProps & {
  paramName: string;
};

const ParamsSelect = ({
  paramName,
  defaultValue,
  ...props
}: ParamsSelectProps) => {
  const [value, setValue] = useSearchParamsState(
    paramName,
    defaultValue?.toString(),
  );
  return <Select {...props} value={value} onChange={(v) => setValue(v)} />;
};

export default ParamsSelect;
