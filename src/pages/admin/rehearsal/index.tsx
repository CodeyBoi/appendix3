import { Group, Select, SelectItem, Stack, Tabs, Title } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import Loading from '../../../components/loading';
import RehearsalList from '../../../components/rehearsal/list';
import RehearsalStats from '../../../components/rehearsal/stats';
import { trpc } from '../../../utils/trpc';
import { getOperatingYear } from '../../stats/[paramYear]';
import { newUTCDate } from '../../../utils/date';

const Rehearsals = () => {
  const [year, setYear] = useState(getOperatingYear());
  const start = newUTCDate(year, 8, 1);
  const end = newUTCDate(year + 1, 7, 31);
  const startYear = 2010;
  const endYear = new Date().getFullYear();

  const years = [] as SelectItem[];
  for (let i = endYear; i >= startYear; i--) {
    years.push({
      value: i.toString(),
      label: i.toString() + '-' + (i + 1).toString(),
    });
  }

  const { data: rehearsals, isInitialLoading: rehearsalsLoading } =
    trpc.rehearsal.getMany.useQuery({
      start,
      end,
    });
  const { data: orchestraStats, isInitialLoading: orchestraStatsLoading } =
    trpc.rehearsal.getOrchestraStats.useQuery({
      start,
      end,
    });

  const { data: balletStats, isInitialLoading: balletStatsLoading } =
    trpc.rehearsal.getBalletStats.useQuery({
      start,
      end,
    });

  const isInitialLoading =
    rehearsalsLoading || orchestraStatsLoading || balletStatsLoading;

  type SplitRehearsals = {
    orchestra: typeof rehearsals;
    ballet: typeof rehearsals;
  };
  const splitRehearsals = useMemo(() => {
    if (!rehearsals) return null;
    return rehearsals.reduce(
      (acc, rehearsal) => {
        if (rehearsal.type === 'Orkesterrepa') {
          acc.orchestra?.push(rehearsal);
        } else if (rehearsal.type === 'Balettrepa') {
          acc.ballet?.push(rehearsal);
        }
        return acc;
      },
      { orchestra: [], ballet: [] } as SplitRehearsals,
    );
  }, [rehearsals]);

  return (
    <Stack align='flex-start'>
      <Title order={2}>Repor</Title>
      <Select
        label='Verksamhetsår'
        value={year.toString()}
        onChange={(value) => setYear(parseInt(value as string))}
        data={years}
      />
      <Tabs defaultValue='all-rehearsals'>
        <Tabs.List mb={12}>
          <Tabs.Tab value='all-rehearsals'>Alla repor</Tabs.Tab>
          <Tabs.Tab value='stats'>Statistik</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='all-rehearsals'>
          {isInitialLoading && <Loading msg='Laddar repor...' />}
          {splitRehearsals && (
            <Group position='left' align='baseline'>
              <Stack>
                <Title order={3}>Orkesterrepor</Title>
                <RehearsalList rehearsals={splitRehearsals.orchestra ?? []} />
              </Stack>
              <Stack>
                <Title order={3}>Balettrepor</Title>
                <RehearsalList rehearsals={splitRehearsals.ballet ?? []} />
              </Stack>
            </Group>
          )}
        </Tabs.Panel>

        <Tabs.Panel value='stats'>
          {isInitialLoading && <Loading msg='Laddar repstatistik...' />}
          {orchestraStats && balletStats && (
            <Group position='left' align='baseline'>
              <Stack>
                <Title order={3}>Orkesterrepor</Title>
                <RehearsalStats
                  stats={orchestraStats.stats}
                  totalRehearsals={orchestraStats.rehearsalCount}
                />
              </Stack>
              <Stack>
                <Title order={3}>Balettrepor</Title>
                <RehearsalStats
                  stats={balletStats.stats}
                  totalRehearsals={balletStats.rehearsalCount}
                />
              </Stack>
            </Group>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Rehearsals;
