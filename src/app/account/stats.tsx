'use client';

import { getOperatingYear } from 'utils/date';
import { trpc } from 'utils/trpc';
import Loading from 'components/loading';
import { lang } from 'utils/language';

type CorpsStatsProps = {
  balance: number;
};

const CorpsStats = ({ balance }: CorpsStatsProps) => {
  const operatingYear = getOperatingYear();
  const start = new Date(operatingYear, 8, 1); // September 1st
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const operatingYearEnd = new Date(operatingYear + 1, 7, 31); // August 31st next year
  // If we're in the same year, we want to show the stats up to today
  const end = currentDate < operatingYearEnd ? currentDate : operatingYearEnd;
  const { data: points, isLoading: pointsLoading } =
    trpc.corps.getPoints.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.stats.get.useQuery({
    start,
    end,
    selfOnly: true,
  });
  const {
    data: orchestraRehearsalAttendance,
    isLoading: orchestraAttendanceLoading,
  } = trpc.rehearsal.getOwnOrchestraAttendance.useQuery({
    start,
    end,
  });
  const {
    data: balletRehearsalAttendance,
    isLoading: balletAttendanceLoading,
  } = trpc.rehearsal.getOwnBalletAttendance.useQuery({
    start,
    end,
  });
  const corpsStats = stats?.corpsStats[stats.corpsIds[0] as string];

  const loading =
    pointsLoading ||
    statsLoading ||
    orchestraAttendanceLoading ||
    balletAttendanceLoading;
  return (
    <div className='flex flex-col space-y-2'>
      {loading && <Loading msg='Hämtar statistik...' />}
      {points !== undefined && (
        <h5>
          {lang(
            `Du har totalt ${points} spelpoäng!`,
            `You have a total of ${points} gig points!`,
          )}
        </h5>
      )}
      {/*Strecksaldo: {balance}*/}
      {corpsStats &&
        orchestraRehearsalAttendance !== undefined &&
        balletRehearsalAttendance !== undefined && (
          <div className='flex flex-col'>
            <h5>
              {lang('Nuvarande verksamhetsår', 'Current operating year')}
              {` (${operatingYear}-${operatingYear + 1}):`}
            </h5>
            <div>
              {lang('Spelpoäng: ', 'Gig points: ')}
              {corpsStats.gigsAttended}
              <br />
              {lang('Spelningar: ', 'Gigs: ')}
              {Math.ceil(corpsStats.attendence * 100) + '%'}
              {orchestraRehearsalAttendance !== 0 && (
                <>
                  <br />
                  {lang('Orkesterrepor: ', 'Orchestra rehearsals: ')}
                  {Math.ceil(orchestraRehearsalAttendance * 100) + '%'}
                </>
              )}
              {balletRehearsalAttendance !== 0 && (
                <>
                  <br />
                  {lang('Balettrepor: ', 'Ballet rehearsals: ')}
                  {Math.ceil(balletRehearsalAttendance * 100) + '%'}
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default CorpsStats;
