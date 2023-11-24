import { api } from 'trpc/server';
import { newUTCDate } from 'utils/date';

type RehearsalStatsProps = {
  totalRehearsals: number;
  stats: {
    corps: { id: string; number: number | null; displayName: string };
    count: number;
  }[];
};

const RehearsalStatsTable = ({
  totalRehearsals,
  stats,
}: RehearsalStatsProps) => {
  return (
    <table className='table'>
      <tbody className='divide-y divide-solid dark:divide-neutral-800'>
        {stats.map((stat) => (
          <tr key={stat.corps.id}>
            <td className='pr-1 text-right'>
              {stat.corps.number ? '#' + stat.corps.number : 'p.e.'}
            </td>
            <td className='pr-2'>{stat.corps.displayName}</td>
            <td className='px-2'>{stat.count}</td>
            <td className='pl-2'>
              {Math.ceil((stat.count / totalRehearsals) * 100)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const RehearsalStats = async ({ year }: { year: string }) => {
  const start = newUTCDate(+year, 8, 1);
  const end = newUTCDate(+year + 1, 7, 31);

  const orchestraQuery = api.rehearsal.getOrchestraStats.query({ start, end });
  const balletQuery = api.rehearsal.getBalletStats.query({ start, end });

  const [orchestraStats, balletStats] = await Promise.all([
    orchestraQuery,
    balletQuery,
  ]);

  return (
    <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
      <div className='flex flex-col gap-2'>
        <h3>Orkesterrepor</h3>
        <RehearsalStatsTable
          stats={orchestraStats.stats}
          totalRehearsals={orchestraStats.nonPositiveRehearsals}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <h3>Balettrepor</h3>
        <RehearsalStatsTable
          stats={balletStats.stats}
          totalRehearsals={balletStats.nonPositiveRehearsals}
        />
      </div>
    </div>
  );
};

export default RehearsalStats;
