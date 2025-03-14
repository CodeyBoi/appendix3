import { newUTCDate } from 'utils/date';
import { api } from 'trpc/server';
import Link from 'next/link';
import dayjs from 'dayjs';

interface Rehearsal {
  id: string;
  date: Date;
  title: string;
}
interface RehearsalsProps {
  rehearsals: Rehearsal[];
}

const RehearsalListTable = ({ rehearsals }: RehearsalsProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {rehearsals.map((rehearsal) => (
        <Link key={rehearsal.id} href={`/admin/rehearsal/${rehearsal.id}`}>
          <div className='rounded border p-4 shadow-md dark:border-neutral-800'>
            <div className='flex gap-4'>
              <div>{dayjs(rehearsal.date).format('YYYY-MM-DD')}</div>
              <div>{rehearsal.title}</div>
            </div>
          </div>
        </Link>
      ))}
      {rehearsals.length === 0 && (
        <div>Inga rep finns registrerade detta år</div>
      )}
    </div>
  );
};

const RehearsalList = async ({ year }: { year: string }) => {
  const start = newUTCDate(+year, 8, 1);
  const end = newUTCDate(+year + 1, 7, 31);

  const rehearsals = await api.rehearsal.getMany.query({
    start,
    end,
  });

  if (rehearsals.length === 0) {
    return <h3>Inga rep finns registrerade detta år</h3>;
  }

  interface SplitRehearsals {
    orchestra: typeof rehearsals;
    ballet: typeof rehearsals;
  }
  const splitRehearsals = rehearsals.reduce<SplitRehearsals>(
    (acc, rehearsal) => {
      if (rehearsal.type === 'Orkesterrepa') {
        acc.orchestra.push(rehearsal);
      } else if (rehearsal.type === 'Balettrepa') {
        acc.ballet.push(rehearsal);
      }
      return acc;
    },
    { orchestra: [], ballet: [] },
  );

  return (
    <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
      <div className='flex flex-col gap-2'>
        <h3>Orkesterrepor</h3>
        <RehearsalListTable rehearsals={splitRehearsals.orchestra} />
      </div>
      <div className='flex flex-col gap-2'>
        <h3>Balettrepor</h3>
        <RehearsalListTable rehearsals={splitRehearsals.ballet} />
      </div>
    </div>
  );
};

export default RehearsalList;
