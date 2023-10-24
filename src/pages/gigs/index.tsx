import { Tabs } from '@mantine/core';
import dayjs from 'dayjs';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Button from 'components/input/button';
import Loading from 'components/loading';
import { trpc } from 'utils/trpc';
import Select from 'components/input/select';
import { IconPlus } from '@tabler/icons';

type Tab = 'all-gigs' | 'my-gigs';
interface GigsProps {
  initialTab?: Tab;
}

const startYear = 2010;

const Gigs = ({ initialTab }: GigsProps) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const { year: routerYear, tab: routerTab } = router.query;
  const year = parseInt(routerYear as string) || currentYear;
  const tab = (routerTab as Tab) || initialTab || 'my-gigs';
  // TODO: FIX THIS (I HATE DATES (this gets the day before the current day))
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const { data: allGigs, isLoading: allGigsLoading } =
    trpc.gig.getMany.useQuery(
      { startDate, endDate, dateOrder: 'desc' },
      { enabled: tab === 'all-gigs' },
    );
  const { data: myGigs, isLoading: myGigsLoading } =
    trpc.gig.getAttended.useQuery(
      { startDate, endDate },
      { enabled: tab === 'my-gigs' },
    );

  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === 'admin';

  const loading =
    (allGigsLoading && tab === 'all-gigs') ||
    (myGigsLoading && tab === 'my-gigs');

  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({
    label: (startYear + i).toString(),
    value: (startYear + i).toString(),
  })).reverse();

  const changeYear = (year: string) => {
    router.push(`/gigs?tab=${tab}&year=${year}`, undefined, {
      shallow: true,
    });
  };

  const changeTab = (tab: Tab) => {
    router.push(`/gigs?tab=${tab}&year=${year}`, undefined, {
      shallow: true,
    });
  };

  let lastGigMonth: number;

  const currentGigs = tab === 'my-gigs' ? myGigs : allGigs;

  const gigTable = loading ? (
    <Loading msg='Laddar spelningar...' />
  ) : currentGigs && currentGigs.length > 0 ? (
    <div className='flex flex-col divide-y divide-solid'>
      {currentGigs.map((gig) => {
        const gigMonth = gig.date.getMonth();
        let shouldAddMonth = false;
        if (gigMonth !== lastGigMonth) {
          lastGigMonth = gigMonth;
          shouldAddMonth = true;
        }
        return (
          <React.Fragment key={gig.id}>
            {shouldAddMonth && (
              <h3 className='pt-2'>
                {gig.date.toLocaleString('sv-SE', { month: 'long' })}
              </h3>
            )}
            <Link href={`/gig/${gig.id}`} key={gig.id}>
              <div className='flex items-center gap-2 py-1 pl-2 cursor-pointer hover:bg-red-300/10'>
                <div className='w-24'>
                  {dayjs(gig.date).format('YYYY-MM-DD')}
                </div>
                {gig.title}
              </div>
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  ) : (
    <h4>Här fanns inget att se :/</h4>
  );

  return (
    <div className='flex flex-col gap-2 max-w-fit'>
      <Head>
        <title>Spelningar</title>
      </Head>
      <h2>Spelningar</h2>
      <div className='flex items-end'>
        <Select
          label='År'
          options={years}
          value={year.toString()}
          onChange={changeYear}
        />
        {isAdmin && (
          <Button href='/admin/gig/new'>
            <IconPlus />
            Skapa spelning
          </Button>
        )}
      </div>

      <Tabs value={tab} onTabChange={changeTab}>
        <Tabs.List pl={8}>
          <div className='flex flex-nowrap'>
            <Tabs.Tab value='my-gigs'>Mina spelningar</Tabs.Tab>
            <Tabs.Tab value='all-gigs'>Alla spelningar</Tabs.Tab>
          </div>
        </Tabs.List>

        <Tabs.Panel value='my-gigs' pt='xs'>
          {gigTable}
        </Tabs.Panel>

        <Tabs.Panel value='all-gigs' pt='xs'>
          {gigTable}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Gigs;
