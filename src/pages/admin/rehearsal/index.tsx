import { Modal, Tabs } from '@mantine/core';
import { useMemo, useState } from 'react';
import { newUTCDate } from 'utils/date';
import { trpc } from 'utils/trpc';
import { getOperatingYear } from 'pages/stats/[paramYear]';
import dynamic from 'next/dynamic';
import Select, { SelectItem } from 'components/input/select';

const Button = dynamic(() => import('components/input/button'));
const Loading = dynamic(() => import('components/loading'));
const RehearsalForm = dynamic(() => import('components/rehearsal/form'));
const RehearsalList = dynamic(() => import('components/rehearsal/list'));
const RehearsalStats = dynamic(() => import('components/rehearsal/stats'));

const Rehearsals = () => {
  const [year, setYear] = useState(getOperatingYear());
  const [modalOpen, setModalOpen] = useState(false);
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
    <>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<h3>Skapa repa</h3>}
      >
        <RehearsalForm onSubmit={() => setModalOpen(false)} />
      </Modal>
      <div className='flex flex-col gap-2 max-w-max'>
        <h2>Repor</h2>
        <div className='flex items-end gap-4'>
          <Select
            label='Verksamhetsår'
            value={year.toString()}
            onChange={(value) => setYear(parseInt(value as string))}
            options={years}
          />
          <Button onClick={() => setModalOpen(true)}>Skapa repa</Button>
        </div>
        <Tabs defaultValue='all-rehearsals'>
          <Tabs.List>
            <Tabs.Tab value='all-rehearsals'>Alla repor</Tabs.Tab>
            <Tabs.Tab value='stats'>Statistik</Tabs.Tab>
          </Tabs.List>
          <br />
          <Tabs.Panel value='all-rehearsals'>
            {isInitialLoading && <Loading msg='Laddar repor...' />}
            {splitRehearsals && (
              <div className='flex items-baseline gap-4'>
                <div className='flex flex-col gap-2'>
                  <h3>Orkesterrepor</h3>
                  <RehearsalList rehearsals={splitRehearsals.orchestra ?? []} />
                </div>
                <div className='flex flex-col gap-2'>
                  <h3>Balettrepor</h3>
                  <RehearsalList rehearsals={splitRehearsals.ballet ?? []} />
                </div>
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value='stats'>
            {isInitialLoading && <Loading msg='Laddar repstatistik...' />}
            {orchestraStats && balletStats && (
              <div className='flex items-baseline gap-4'>
                <div className='flex flex-col gap-2'>
                  <h3>Orkesterrepor</h3>
                  <RehearsalStats
                    stats={orchestraStats.stats}
                    totalRehearsals={orchestraStats.nonPositiveRehearsals}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <h3>Balettrepor</h3>
                  <RehearsalStats
                    stats={balletStats.stats}
                    totalRehearsals={balletStats.nonPositiveRehearsals}
                  />
                </div>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default Rehearsals;
