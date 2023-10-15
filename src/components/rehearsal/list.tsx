import { Card } from '@mantine/core';
import { NextLink } from '@mantine/next';
import dayjs from 'dayjs';

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
        <Card
          key={rehearsal.id}
          shadow='sm'
          component={NextLink}
          href={`/admin/rehearsal/${rehearsal.id}`}
        >
          <div className='flex gap-4'>
            <div>{dayjs(rehearsal.date).format('YYYY-MM-DD')}</div>
            <div>{rehearsal.title}</div>
          </div>
        </Card>
      ))}
      {rehearsals && rehearsals.length === 0 && (
        <div>Inga rep finns registrerade detta år</div>
      )}
    </div>
  );
};

export default RehearsalList;
