'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import Switch, { SwitchProps } from './switch';

type ParamsSwitchProps = SwitchProps & {
  paramName: string;
};

const ParamsSwitch = ({
  paramName,
  defaultChecked,
  ...props
}: ParamsSwitchProps) => {
  const [value, setValue] = useSearchParamsState(
    paramName,
    defaultChecked === true ? 'true' : '',
  );
  return (
    <Switch
      {...props}
      checked={value === 'true'}
      onChange={(v) => setValue(v ? 'true' : '')}
    />
  );
};

export default ParamsSwitch;
