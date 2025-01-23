import TimeDelta from 'components/time-delta';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

interface CorpsProfilePageProps {
  params: {
    number: string;
  };
}

export const generateMetadata = ({
  params: { number },
}: CorpsProfilePageProps) => ({
  title: `#${number}`,
  description: `Profilsida för #${number}`,
});

const CorpsProfilePage = async ({ params }: CorpsProfilePageProps) => {
  const number = parseInt(params.number);

  if (isNaN(number)) {
    return (
      <h4>
        {lang(
          `Ogiltigt nummer: ${params.number}`,
          `Invalid number: ${params.number}`,
        )}
      </h4>
    );
  }

  const corps = await api.corps.getProfile.query({ number });

  if (!corps) {
    return (
      <h4>
        {lang(`#${number} existerar inte.`, `#${number} does not exist.`)}
      </h4>
    );
  }

  const longestStreak = await api.stats.getAllTimeStreak.query({
    corpsId: corps.id,
  });

  return (
    <div className='flex max-w-xl gap-2'>
      <h2>{`#${corps.number}`}</h2>
      <div className='flex flex-col gap-4'>
        <div className='h-48 w-48 bg-cyan-500' />
        <span className='text-sm font-thin'>
          <div>
            {lang(`Spelpoäng: ${corps.gigs}`, `Gig points: ${corps.gigs}`)}
          </div>
          <div>
            {lang(
              `Repor: ${corps.rehearsals}`,
              `Rehearsals: ${corps.rehearsals}`,
            )}
          </div>
          <div>{lang(`Mord: ${corps.kills}`, `Kills: ${corps.kills}`)}</div>
          {longestStreak.maxStreak >= 3 && (
            <div>
              {lang(
                `Längsta streak: ${longestStreak.maxStreak}🔥`,
                `Longest streak: ${longestStreak.maxStreak}🔥`,
              )}
            </div>
          )}
          {corps.joined && (
            <div>
              {lang('Corpsålder: ', 'Corps age: ')}
              <TimeDelta time={corps.joined} minGranularity='day' />
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default CorpsProfilePage;
