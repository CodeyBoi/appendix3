import { Corps } from '@prisma/client';

type RehearsalStatsProps = {
  totalRehearsals: number;
  stats: {
    corps: Corps;
    count: number;
  }[];
};

const formatName = (corps: Corps) => {
  const prefix = corps.number ? '#' + corps.number.toString() : 'p.e.';
  return `${prefix} ${corps.firstName} ${corps.lastName}`;
};

const RehearsalStats = ({ totalRehearsals, stats }: RehearsalStatsProps) => {
  return (
    <table className='table'>
      <tbody className='divide-y divide-solid'>
        {stats.map((stat) => (
          <tr key={stat.corps.id}>
            <td className='pr-2'>{formatName(stat.corps)}</td>
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

export default RehearsalStats;
