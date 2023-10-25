'use client';

import { getOperatingYear } from 'utils/date';
import { trpc } from 'utils/trpc';
import Loading from 'components/loading';

const CorpsStats = () => {
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
      <h3>Närvaro</h3>
      {loading && <Loading msg='Laddar...' />}
      {points !== undefined && <h5>{`Du har totalt ${points} spelpoäng!`}</h5>}
      {corpsStats &&
        orchestraRehearsalAttendance !== undefined &&
        balletRehearsalAttendance !== undefined && (
          <div className='flex flex-col'>
            <h6>
              {`Nuvarande verksamhetsår (${operatingYear}-${
                operatingYear + 1
              }):`}
            </h6>
            <div>
              {`Spelpoäng: ${corpsStats.gigsAttended}`}
              <br />
              {`Spelningar: ${Math.ceil(corpsStats.attendence * 100)}%`}
              {orchestraRehearsalAttendance !== 0 && (
                <>
                  <br />
                  {`Orkesterrepor: ${Math.ceil(
                    orchestraRehearsalAttendance * 100,
                  )}%`}
                </>
              )}
              {balletRehearsalAttendance !== 0 && (
                <>
                  <br />
                  {`Balettrepor: ${Math.ceil(
                    balletRehearsalAttendance * 100,
                  )}%`}
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default CorpsStats;
