import { IconPlus } from '@tabler/icons-react';
import Button from 'components/input/button';
import { SelectItem } from 'components/input/select';
import ParamsSelect from 'components/input/params-select';
import Tabs from 'components/input/tabs';
import Loading from 'components/loading';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import RehearsalStats from './stats';
import RehearsalList from './list';
import Restricted from 'components/restricted/server';
import { getOperatingYear } from 'utils/date';

const startYear = 2010;

const tabs = [
  { value: 'rehearsals', label: 'Alla repor' },
  { value: 'stats', label: 'Statistik' },
];

const AdminRehearsalsPage = async ({
  searchParams,
}: {
  searchParams: { year: string; tab: string };
}) => {
  const currentYear = getOperatingYear();
  const { year, tab } = searchParams;
  if (
    !year ||
    isNaN(+year) ||
    +year < 2010 ||
    +year > currentYear ||
    +year % 1 !== 0 ||
    !tab ||
    !tabs.map((t) => t.value).includes(tab)
  ) {
    redirect(`/admin/rehearsal?year=${currentYear}&tab=rehearsals`);
  }
  const endYear = new Date().getFullYear();
  const years = [] as SelectItem[];
  for (let i = endYear; i >= startYear; i--) {
    years.push({
      value: i.toString(),
      label: i.toString() + '-' + (i + 1).toString(),
    });
  }

  return (
    <div className='flex max-w-max flex-col gap-2'>
      <h2>Repor</h2>
      <div className='flex items-end gap-4'>
        <ParamsSelect label='Verksamhetsår' options={years} paramName='year' />
        <Restricted permissions='manageRehearsals'>
          <Button href='/admin/rehearsal/edit/new'>
            <IconPlus />
            Skapa repa
          </Button>
        </Restricted>
      </div>
      <Tabs options={tabs} />
      <Suspense
        key={`${year}_${tab}`}
        fallback={<Loading msg='Hämtar repor...' />}
      >
        {tab === 'rehearsals' && <RehearsalList year={year} />}
        {tab === 'stats' && <RehearsalStats year={year} />}
      </Suspense>
    </div>
  );
};

export default AdminRehearsalsPage;
