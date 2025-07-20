'use client'

import SelectCorps from "components/select-corps";
import { useSearchParamsState } from "hooks/use-search-params-state"

const ParamsSelectCorps = () => {
  const [value, setValue] = useSearchParamsState('id', { refreshMethod: 'push' });

  return <SelectCorps placeholder='Välj corps...' value={value} onChange={setValue} />
}

export default ParamsSelectCorps;
