'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import TextInput, { TextInputProps } from './text-input';

type ParamsTextInputProps = TextInputProps & {
  paramName: string;
  shallowRefresh?: boolean;
};

const ParamsTextInput = ({
  paramName,
  defaultValue,
  shallowRefresh = false,
  ...props
}: ParamsTextInputProps) => {
  const [value, setValue] = useSearchParamsState(
    paramName,
    defaultValue?.toString(),
    shallowRefresh,
  );
  return (
    <TextInput
      {...props}
      value={value}
      onChange={(v) => {
        setValue(v);
      }}
    />
  );
};

export default ParamsTextInput;
