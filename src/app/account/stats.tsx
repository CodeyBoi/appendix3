import { getOperatingYear } from 'utils/date';
import { lang } from 'utils/language';
import { api } from 'trpc/server';

const CorpsStats = async () => {
  const operatingYear = getOperatingYear();
  const start = new Date(operatingYear, 8, 1); // September 1st
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const operatingYearEnd = new Date(operatingYear + 1, 7, 31); // August 31st next year
  // If we're in the same year, we want to show the stats up to today
  const end = currentDate < operatingYearEnd ? currentDate : operatingYearEnd;

  const pointsQuery = api.corps.getPoints.query();
  const statsQuery = api.stats.get.query({
    start,
    end,
    selfOnly: true,
  });
  const orchestraRehearsalAttendanceQuery =
    api.rehearsal.getOwnOrchestraAttendance.query({ start, end });
  const balletRehearsalAttendanceQuery =
    api.rehearsal.getOwnBalletAttendance.query({ start, end });
  const streckAccountQuery = api.streck.getOwnStreckAccount.query({});

  const [
    corps,
    points,
    stats,
    orchestraRehearsalAttendance,
    balletRehearsalAttendance,
    streckAccount,
  ] = await Promise.all([
    api.corps.getSelf.query(),
    pointsQuery,
    statsQuery,
    orchestraRehearsalAttendanceQuery,
    balletRehearsalAttendanceQuery,
    streckAccountQuery,
  ]);

  const corpsStats = stats?.corpsStats[stats.corpsIds[0] as string];
  const streckAccountStr = lang(
    'Strecksaldo: ' + streckAccount.balance.toString(),
    'Streck balance: ' + streckAccount.balance.toString(),
  );

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex flex-col'>
        <h5>
          {lang(
            `Du har totalt ${points} spelpoäng!`,
            `You have a total of ${points} gig points!`,
          )}
        </h5>
        <span className='hidden'>
          {corps?.number ? (
            <a className='hover:underline' href='account/streck'>
              {streckAccountStr}
            </a>
          ) : (
            <>{streckAccountStr}</>
          )}
        </span>
      </div>
      <div className='flex flex-col'>
        <h5>
          {lang('Nuvarande verksamhetsår', 'Current operating year')}
          {` (${operatingYear}-${operatingYear + 1}):`}
        </h5>
        <div>
          {lang('Spelpoäng: ', 'Gig points: ')}
          {corpsStats?.gigsAttended || 0}
          <br />
          {lang('Spelningar: ', 'Gigs: ')}
          {Math.ceil((corpsStats?.attendence || 0) * 100) + '%'}
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
    </div>
  );
};

export default CorpsStats;
