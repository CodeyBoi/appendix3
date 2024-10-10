import { IconMoodNerd } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';
import Button from 'components/input/button';
import { api } from 'trpc/server';
import CorpsDisplay from 'components/corps/display';
import { lang } from 'utils/language';

interface StatisticsTableProps {
  start: Date;
  end: Date | undefined;
}

const StatisticsTable = async ({ start, end }: StatisticsTableProps) => {
  const stats = await api.stats.get.query({
    start,
    end,
  });
  const { nbrOfGigs, positivelyCountedGigs, corpsStats, corpsIds } =
    stats ?? {};

  const corpsStreaks = await api.stats.getStreak.query({ corpsIds });
  const corps = await api.corps.getSelf.query();

  const isNow = !end;

  const nbrOfGigsMsg =
    nbrOfGigs !== 0
      ? lang(
          `Denna period ${
            isNow ? 'har vi hittills haft' : 'hade vi'
          } ${nbrOfGigs} spelning${nbrOfGigs === 1 ? '' : 'ar'}`,
          `During this period we ${isNow ? 'have' : ''} had ${nbrOfGigs} gig${
            nbrOfGigs === 1 ? '' : 's'
          }`,
        )
      : '';
  const positiveGigsString =
    (positivelyCountedGigs ?? 0) > 0
      ? lang(
          `, där ${positivelyCountedGigs} ${
            isNow ? 'räknats' : 'räknades'
          } positivt.`,
          `, of which ${positivelyCountedGigs} ${
            isNow ? 'are' : 'were'
          } counted positively.`,
        )
      : '.';

  const ownPoints =
    corps && stats ? stats.corpsStats[corps.id]?.gigsAttended : undefined;
  const ownAttendence =
    corps && stats ? stats.corpsStats[corps.id]?.attendence : undefined;
  // Somehow ownPoints is a string, so == is used instead of ===
  const ownPointsMsg =
    ownPoints && ownAttendence && nbrOfGigs !== 0
      ? lang(
          `Du ${isNow ? 'har varit' : 'var'} med på ${ownPoints} spelning${
            ownPoints == 1 ? '' : 'ar'
          }, vilket ${isNow ? 'motsvarar' : 'motsvarade'} ${Math.ceil(
            ownAttendence * 100,
          )}% närvaro.`,
          `You ${isNow ? 'have been to' : 'were at'} ${ownPoints} gig${
            ownPoints == 1 ? '' : 's'
          }, which ${isNow ? 'corresponds' : 'corresponded'} to ${Math.ceil(
            ownAttendence * 100,
          )}% attendance.`,
        )
      : undefined;

  return (
    <>
      {corpsIds && corpsIds.length === 0 && (
        <div>
          {lang(
            'Det finns inga statistikuppgifter för denna period.',
            'There are no statistics for this period.',
          )}
        </div>
      )}
      {corpsIds && corpsIds.length !== 0 && corpsStats && (
        <div className='flex flex-col gap-2'>
          <div>
            {nbrOfGigsMsg}
            {nbrOfGigs !== 0 ? positiveGigsString : ''}
          </div>
          {ownPointsMsg && <div>{ownPointsMsg}</div>}
          <table className='divide-y divide-solid dark:border-neutral-700'>
            <thead>
              <tr>
                <th className='text-left'>Corps</th>
                <th className='px-1 text-center'>{lang('Poäng', 'Points')}</th>
                <th className='px-1 text-center'>
                  {lang('Närvaro', 'Attendence')}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-solid text-sm dark:border-neutral-700'>
              {corpsIds.map((id) => {
                const stat = corpsStats[id];
                if (!stat) return null;
                const streak = corpsStreaks.streaks[id] ?? 0;
                return (
                  <React.Fragment key={stat.id}>
                    <tr>
                      <td className='flex gap-2 py-1'>
                        <CorpsDisplay corps={stat} />
                        {streak >= 3 && `${streak}🔥`}
                      </td>
                      <td className='text-center'>{stat.gigsAttended}</td>
                      <td className='pl-0 text-center'>
                        {`${Math.ceil(stat.attendence * 100)}%`}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
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
      )}
    </>
  );
};

export default StatisticsTable;
