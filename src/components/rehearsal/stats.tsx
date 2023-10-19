type RehearsalStatsProps = {
  totalRehearsals: number;
  stats: {
    corps: { id: string; number: number | null; displayName: string };
    count: number;
  }[];
};

const RehearsalStats = ({ totalRehearsals, stats }: RehearsalStatsProps) => {
  return (
    <table className='table'>
      <tbody className='divide-y divide-solid'>
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

export default RehearsalStats;
