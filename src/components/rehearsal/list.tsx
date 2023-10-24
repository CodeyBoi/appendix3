import dayjs from 'dayjs';
import Link from 'next/link';

type Rehearsal = {
  id: string;
  date: Date;
  title: string;
};
type RehearsalsProps = {
  rehearsals: Rehearsal[];
};

const RehearsalList = ({ rehearsals }: RehearsalsProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {rehearsals?.map((rehearsal) => (
        <Link href={`/admin/rehearsal/${rehearsal.id}`}>
          <div
            className='p-4 border rounded shadow-md dark:border-neutral-800'
            key={rehearsal.id}
          >
            <div className='flex gap-4'>
              <div>{dayjs(rehearsal.date).format('YYYY-MM-DD')}</div>
              <div>{rehearsal.title}</div>
            </div>
          </div>
        </Link>
      ))}
      {rehearsals && rehearsals.length === 0 && (
        <div>Inga rep finns registrerade detta år</div>
      )}
    </div>
  );
};

export default RehearsalList;
