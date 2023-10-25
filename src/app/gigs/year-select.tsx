'use client';

import { useSearchParamsState } from 'hooks/use-search-params-state';
import Select from 'components/input/select';

const startYear = 2010;
const years = Array.from(
  { length: new Date().getFullYear() - startYear + 1 },
  (_, i) => ({
    label: (startYear + i).toString(),
    value: (startYear + i).toString(),
  }),
).reverse();

const GigsYearSelect = ({ defaultValue }: { defaultValue: string }) => {
  const [_year, setYear] = useSearchParamsState('year', defaultValue);
  return (
    <Select
      label='År'
      options={years}
      onChange={(y) => setYear(y)}
      defaultValue={defaultValue}
    />
  );
};

export default GigsYearSelect;
