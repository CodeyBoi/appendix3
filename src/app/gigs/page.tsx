import Button from 'components/input/button';
import Loading from 'components/loading';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { api } from 'trpc/server';
import { IconPlus } from '@tabler/icons-react';
import Tabs from 'components/input/tabs';
import GigList from './list';
import ParamsSelect from 'components/input/params-select';
import { SelectItem } from 'components/input/select';
import { lang } from 'utils/language';

export const metadata: Metadata = {
  title: 'Spelningar',
};

const startYear = 2010;

const tabs = [
  { value: 'my', label: lang('Mina spelningar', 'My gigs') },
  { value: 'all', label: lang('Alla spelningar', 'All gigs') },
];

const GigsPage = async ({
  searchParams,
}: {
  searchParams: { year: string; tab: string };
}) => {
  const currentYear = new Date().getFullYear();
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
    redirect(`/gigs?year=${currentYear}&tab=my`);
  }

  const endYear = new Date().getFullYear();
  const years = [] as SelectItem[];
  for (let i = endYear; i >= startYear; i--) {
    years.push({
      value: i.toString(),
      label: i.toString(),
    });
  }

  const corps = await api.corps.getSelf.query();
  const isAdmin = corps?.role?.name === 'admin';

  return (
    <div className='flex max-w-fit flex-col'>
      <div className='flex flex-col gap-2'>
        <h2>{lang('Spelningar', 'Gigs')}</h2>
        <div className='flex items-end gap-4'>
          <ParamsSelect
            label={lang('År', 'Year')}
            options={years}
            paramName='year'
            defaultValue={year}
          />
          {isAdmin && (
            <Button href='/admin/gig/new'>
              <IconPlus />
              {lang('Skapa spelning', 'Create gig')}
            </Button>
          )}
        </div>
        <Tabs options={tabs} />
      </div>
      <Suspense
        key={`${year}_${tab}`}
        fallback={
          <Loading msg={lang('Hämtar spelningar...', 'Fetching gigs...')} />
        }
      >
        <GigList year={+year} tab={tab} />
      </Suspense>
    </div>
  );
};

export default GigsPage;
