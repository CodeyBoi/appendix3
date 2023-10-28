'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import TextInput, { TextInputProps } from './text-input';

type ParamsTextInputProps = TextInputProps & {
  paramName: string;
};

const ParamsTextInput = ({
  paramName,
  defaultValue,
  ...props
}: ParamsTextInputProps) => {
  const [value, setValue] = useSearchParamsState(
    paramName,
    defaultValue?.toString(),
  );
  return <TextInput {...props} value={value} onChange={(v) => setValue(v)} />;
};

export default ParamsTextInput;
