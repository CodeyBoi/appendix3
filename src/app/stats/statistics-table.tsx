'use client';

import React, { useState } from 'react';
import { api } from 'trpc/server';
import CorpsDisplay from 'components/corps/display';
import { lang } from 'utils/language';
import { sortCorps } from 'utils/corps';

type Stats = Awaited<ReturnType<typeof api.stats.getMany.query>>;
interface StatisticsTableProps {
  stats: Stats;
  streaks: Awaited<ReturnType<typeof api.stats.getStreak.query>>;
}

type SortBy = 'name' | 'attendance' | 'points' | 'rehearsals';

type StatsEntry = NonNullable<ReturnType<Stats['corpsStats']['get']>>;
const SORTING_FUNCTIONS: Record<
  SortBy,
  (a: StatsEntry, b: StatsEntry) => number
> = {
  attendance: (a, b) => a.attendance - b.attendance,
  name: sortCorps,
  points: (a, b) => a.gigsAttended - b.gigsAttended,
  rehearsals: (a, b) =>
    a.orchestraRehearsalAttendance +
    a.balletRehearsalAttendance -
    b.orchestraRehearsalAttendance -
    b.balletRehearsalAttendance,
};

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

const StatisticsTable = ({
  stats,
  streaks: corpsStreaks,
}: StatisticsTableProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('attendance');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const sortFunc =
    order === 'asc'
      ? SORTING_FUNCTIONS[sortBy]
      : (a: StatsEntry, b: StatsEntry) => -SORTING_FUNCTIONS[sortBy](a, b);

  const setSort = (sort: SortBy) => {
    if (sort === sortBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder('desc');
    }
    setSortBy(sort);
  };

  const { corpsStats, corpsIds } = stats;

  const corpsIdsSorted = corpsIds.sort((a, b) => {
    const aEntry = corpsStats.get(a);
    const bEntry = corpsStats.get(b);
    if (!aEntry) {
      throw new Error(
        `Tried to get stats of corps with id: ${a} but no stats with that id was fetched.`,
      );
    } else if (!bEntry) {
      throw new Error(
        `Tried to get stats of corps with id: ${b} but no stats with that id was fetched.`,
      );
    }
    return sortFunc(aEntry, bEntry);
  });

  const orderIcon = order === 'asc' ? '↑' : '↓';

  return corpsIdsSorted.length === 0 ? (
    <div>
      {lang(
        'Det finns inga statistikuppgifter för denna period.',
        'There are no statistics for this period.',
      )}
    </div>
  ) : (
    <table className='divide-y divide-solid dark:border-neutral-700'>
      <thead>
        <tr className='text-xs'>
          <th
            className='select-none text-left hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('name');
            }}
          >
            Corps
            {sortBy === 'name' && orderIcon}
          </th>
          <th
            className='select-none px-1 text-center hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('points');
            }}
          >
            {lang('Poäng', 'Points')}
            {sortBy === 'points' && orderIcon}
          </th>
          <th
            className='select-none px-1 text-center hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('attendance');
            }}
          >
            {lang('Närvaro', 'Attendance')}
            {sortBy === 'attendance' && orderIcon}
          </th>
          <th
            className='select-none px-1 text-center hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('rehearsals');
            }}
          >
            {lang('Rep', 'Reh.')}
            {sortBy === 'rehearsals' && orderIcon}
          </th>
        </tr>
      </thead>
      <tbody className='divide-y divide-solid text-sm dark:border-neutral-700'>
        {corpsIdsSorted.map((id) => {
          const stat = corpsStats.get(id);
          if (!stat) return null;
          const streak = corpsStreaks.streaks.get(id) ?? 0;
          const points = `${stat.gigsAttended - stat.positiveGigsAttended}${
            stat.positiveGigsAttended > 0 ? `+${stat.positiveGigsAttended}` : ''
          }`;
          const bothRehearsals =
            stat.orchestraRehearsalAttendance + stat.balletRehearsalAttendance;
          return (
            <React.Fragment key={stat.id}>
              <tr>
                <td className='flex gap-2 py-1'>
                  <CorpsDisplay corps={stat} />
                  <span className='whitespace-nowrap'>
                    {streak >= 3 &&
                      streak < 200 &&
                      `${streak}${getStreakEmoji(streak)}`}
                    {streak >= 200 && (
                      <div className='flex gap-1'>
                        {streak}
                        <img className='h-6' src='imgs/bruh.png'></img>
                      </div>
                    )}
                  </span>
                </td>
                <td className='text-center'>{points}</td>
                <td className='text-center'>
                  {`${Math.ceil(stat.attendance * 100)}%`}
                </td>
                <td className='text-center'>
                  {`${Math.ceil(bothRehearsals * 100)}%`}
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default StatisticsTable;
