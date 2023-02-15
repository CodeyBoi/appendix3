import React from 'react';
import { Table, Tabs, Select, Group, Title, Stack } from '@mantine/core';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import Loading from '../../components/loading';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

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
    <Table fontSize={12} highlightOnHover>
      <tbody>
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
                // We set color to unset to get rid of the highlightOnHover for the month
                <tr style={{ backgroundColor: 'unset' }}>
                  <td colSpan={12}>
                    <Title order={4}>
                      {gig.date.toLocaleString('sv-SE', { month: 'long' })}
                    </Title>
                  </td>
                </tr>
              )}
              <Link href={`/gig/${gig.id}`} key={gig.id}>
                <tr style={{ cursor: 'pointer' }}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {dayjs(gig.date).format('YYYY-MM-DD')}
                  </td>
                  <td>{gig.title}</td>
                </tr>
              </Link>
            </React.Fragment>
          );
        })}
      </tbody>
    </Table>
  ) : (
    <Title order={4}>Här fanns inget att se :/</Title>
  );

  return (
    <Stack sx={{ maxWidth: 500 }}>
      <Title order={2}>Spelningar</Title>
      <Group position='left'>
        <Select
          sx={{ width: 100 }}
          label='År'
          maxDropdownHeight={280}
          data={years}
          value={year.toString()}
          onChange={changeYear}
        />
      </Group>
      <Tabs value={tab} onTabChange={changeTab}>
        <Tabs.List pl={8}>
          <Tabs.Tab value='my-gigs'>Mina spelningar</Tabs.Tab>
          <Tabs.Tab value='all-gigs'>Alla spelningar</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='my-gigs' pt='xs'>
          {gigTable}
        </Tabs.Panel>

        <Tabs.Panel value='all-gigs' pt='xs'>
          {gigTable}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Gigs;
