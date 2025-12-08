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

type StreakEmoji = [number, string];
const streakEmojis: StreakEmoji[] = [
  [3, '🔥'],
  [10, '❤️‍🔥'],
  [25, '🔴'],
  [50, '🪨'],
  [75, '🐐'],
  [100, '🗿'],
  [150, '😵‍💫'],
].reverse() as StreakEmoji[];

const getStreakEmoji = (streak: number) =>
  streakEmojis.find(([limit, _]) => streak >= limit)?.[1] ?? '';

const StatisticsTable = async ({ start, end }: StatisticsTableProps) => {
  const [
    { totalGigs, ordinaryGigs, positivelyCountedGigs, corpsStats, corpsIds },
    corpsStreaks,
    corps,
  ] = await Promise.all([
    api.stats.getMany.query({
      start,
      end,
    }),
    api.stats.getStreak.query({ getAll: true }),
    api.corps.getSelf.query(),
  ]);

  const isNow = !end;

  const nbrOfGigsMsg =
    totalGigs !== 0
      ? lang(
          `Denna period ${
            isNow ? 'har vi hittills haft' : 'hade vi'
          } ${ordinaryGigs} ordinarie ${
            positivelyCountedGigs > 0
              ? `och ${positivelyCountedGigs} positiva `
              : ''
          } spelning${
            positivelyCountedGigs === 1 ||
            (positivelyCountedGigs === 0 && ordinaryGigs === 1)
              ? ''
              : 'ar'
          }.`,
          `During this period we ${
            isNow ? 'have' : ''
          } had ${ordinaryGigs} ordinary ${
            positivelyCountedGigs > 0
              ? `and ${positivelyCountedGigs} positive `
              : ''
          } gig${
            positivelyCountedGigs === 1 ||
            (positivelyCountedGigs === 0 && ordinaryGigs === 1)
              ? ''
              : 's'
          }.`,
        )
      : '';

  const ownPositivePoints = corpsStats.get(corps.id)?.positiveGigsAttended ?? 0;
  const ownPoints =
    (corpsStats.get(corps.id)?.gigsAttended ?? 0) - ownPositivePoints;
  const ownAttendance = corpsStats.get(corps.id)?.attendance ?? 0;
  const ownPointsMsg =
    totalGigs !== 0
      ? lang(
          `Du ${isNow ? 'har varit' : 'var'} med på ${ownPoints}${
            ownPositivePoints > 0 ? `+${ownPositivePoints}` : ''
          } spelning${ownPoints === 1 ? '' : 'ar'}, vilket ${
            isNow ? 'motsvarar' : 'motsvarade'
          } ${Math.ceil(ownAttendance * 100)}% närvaro.`,
          `You ${isNow ? 'have been to' : 'were at'} ${ownPoints}${
            ownPositivePoints > 0 ? `+${ownPositivePoints}` : ''
          } gig${ownPoints === 1 ? '' : 's'}, which ${
            isNow ? 'corresponds' : 'corresponded'
          } to ${Math.ceil(ownAttendance * 100)}% attendance.`,
        )
      : '';

  return corpsIds.length === 0 ? (
    <div>
      {lang(
        'Det finns inga statistikuppgifter för denna period.',
        'There are no statistics for this period.',
      )}
    </div>
  ) : (
    <div className='flex flex-col gap-2'>
      <div>{nbrOfGigsMsg}</div>
      {ownPointsMsg && <div>{ownPointsMsg}</div>}
      <div className='overflow-x-auto overflow-y-hidden'>
        <table className='divide-y divide-solid dark:border-neutral-700'>
          <thead>
            <tr className='text-xs'>
              <th className='text-left'>Corps</th>
              <th className='px-1 text-center'>{lang('Poäng', 'Points')}</th>
              <th className='px-1 text-center'>
                {lang('Närvaro', 'Attendance')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-solid text-sm dark:border-neutral-700'>
            {corpsIds.map((id) => {
              const stat = corpsStats.get(id);
              if (!stat) return null;
              const streak = corpsStreaks.streaks.get(id) ?? 0;
              const points = `${stat.gigsAttended - stat.positiveGigsAttended}${
                stat.positiveGigsAttended > 0
                  ? `+${stat.positiveGigsAttended}`
                  : ''
              }`;
              return (
                <React.Fragment key={stat.id}>
                  <tr>
                    <td className='flex gap-2 py-1'>
                      <CorpsDisplay corps={stat} />
                      <span className='whitespace-nowrap'>
                        {streak >= 3 && `${streak}${getStreakEmoji(streak)}`}
                      </span>
                    </td>
                    <td className='text-center'>{points}</td>
                    <td className='text-center'>
                      {`${Math.ceil(stat.attendance * 100)}%`}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
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
  );
};

export default StatisticsTable;
