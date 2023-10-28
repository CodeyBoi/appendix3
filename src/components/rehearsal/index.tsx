import { Rehearsal as RehearsalPrisma } from '@prisma/client';
import { IconEdit } from '@tabler/icons-react';
import React from 'react';
import Button from '../input/button';
import RehearsalAttendence from './attendence';

type RehearsalProps = {
  rehearsal: RehearsalPrisma;
};

const Rehearsal = ({ rehearsal }: RehearsalProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <h1>
        {rehearsal.title + ' (' + rehearsal.date.toLocaleDateString() + ')'}
      </h1>
      <Button href={`/admin/rehearsal/edit/${rehearsal.id}`}>
        <IconEdit />
        Redigera
      </Button>
      <RehearsalAttendence rehearsal={rehearsal} />
    </div>
  );
};

export default Rehearsal;
