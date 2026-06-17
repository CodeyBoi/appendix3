import React, { Suspense } from 'react';
import StatisticsTable from 'app/stats/statistics-table';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { calcOperatingYearInterval, getOperatingYear } from 'utils/date';
import { Metadata } from 'next';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import StatsYearSelect from './year-select';
import { api } from 'trpc/server';
import Link from 'next/link';
import Button from 'components/input/button';
import { IconMoodNerd } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Statistik',
};

const FetchStatisticsTable = async ({
  start,
  end,
}: {
  start?: Date;
  end?: Date;
}) => {
  const [stats, streaks] = await Promise.all([
    api.stats.getMany.query({ start, end }),
    api.stats.getStreak.query({ getAll: true }),
  ]);

  return <StatisticsTable stats={stats} streaks={streaks} />;
};

const Statistics = async ({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) => {
  if (!searchParams.start) {
    const { start, end: _end } = calcOperatingYearInterval(getOperatingYear());
    redirect(`/stats?start=${dayjs(start).format('YYYY-MM-DD')}`);
  }

  const start = new Date(searchParams.start);
  const end = searchParams.end ? new Date(searchParams.end) : undefined;

  const { gigs, gigsAttended } = await api.stats.getSummary.query({
    start,
    end,
  });

  const isNow = !end;

  const nbrOfGigsMsg =
    gigs.total !== 0
      ? lang(
          `Denna period ${isNow ? 'har vi hittills haft' : 'hade vi'} ${
            gigs.ordinary
          } ordinarie ${
            gigs.positive > 0 ? `och ${gigs.positive} positiva ` : ''
          } spelning${
            gigs.positive === 1 || (gigs.positive === 0 && gigs.ordinary === 1)
              ? ''
              : 'ar'
          }.`,
          `During this period we ${isNow ? 'have' : ''} had ${
            gigs.ordinary
          } ordinary ${
            gigs.positive > 0 ? `and ${gigs.positive} positive ` : ''
          } gig${
            gigs.positive === 1 || (gigs.positive === 0 && gigs.ordinary === 1)
              ? ''
              : 's'
          }.`,
        )
      : '';

  const ownPointsMsg =
    gigs.total !== 0
      ? lang(
          `Du ${isNow ? 'har varit' : 'var'} med på ${gigsAttended.ordinary}${
            gigsAttended.positive > 0 ? `+${gigsAttended.positive}` : ''
          } spelning${gigsAttended.ordinary === 1 ? '' : 'ar'}, vilket ${
            isNow ? 'motsvarar' : 'motsvarade'
          } ${Math.ceil(gigsAttended.attendance * 100)}% närvaro.`,
          `You ${isNow ? 'have been to' : 'were at'} ${gigsAttended.ordinary}${
            gigsAttended.positive > 0 ? `+${gigsAttended.positive}` : ''
          } gig${gigsAttended.ordinary === 1 ? '' : 's'}, which ${
            isNow ? 'corresponds' : 'corresponded'
          } to ${Math.ceil(gigsAttended.attendance * 100)}% attendance.`,
        )
      : '';

  return (
    <div className='flex max-w-max flex-col gap-2'>
      <h2>{lang('Statistik', 'Statistics')}</h2>
      <div className='flex items-center gap-4'>
        <div className='w-36'>
          <StatsYearSelect label={lang('Verksamhetsår', 'Operating year')} />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div>{nbrOfGigsMsg}</div>
        {ownPointsMsg && <div>{ownPointsMsg}</div>}
        <Suspense
          key={`${dayjs(start).format('YYYYMMDD')}_${dayjs(end).format(
            'YYYYMMDD',
          )}`}
          fallback={
            <Loading
              msg={lang('Hämtar statistik...', 'Fetching statistics...')}
            />
          }
        >
          <div className='overflow-x-auto overflow-y-hidden'>
            <FetchStatisticsTable start={start} end={end} />
          </div>
        </Suspense>

        <div className='h-96' />
        <div className='h-96' />
        <div className='h-96' />
        <div className='h-96' />
        <div className='h-96' />
        <div className='h-96' />
        <div className='h-96' />
        <Link href='/stats/for/nerds'>
          <div className='flex justify-center'>
            <Button>
              <IconMoodNerd />
              {lang('Statistik för nördar', 'Stats for nerds')}
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Statistics;
