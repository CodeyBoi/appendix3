import { api } from 'trpc/server';
import dayjs from 'dayjs';

const PreliminaryMembers = async () => {
  const preliminaryMembers = await api.stats.getPreliminaryMembers.query();

  return (
    <div className='flex flex-col'>
      {preliminaryMembers.map((corps) => (
        <div key={corps.id}>
          {dayjs(corps.dateAchieved).format('YYYY-MM-DD') +
            ' #' +
            corps.preliminaryNumber +
            ' ' +
            corps.firstName +
            ' ' +
            corps.lastName +
            ' ' +
            corps.gigsAttended}
        </div>
      ))}
    </div>
  );
};

export default PreliminaryMembers;
