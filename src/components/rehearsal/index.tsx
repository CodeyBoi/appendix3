import { Modal } from '@mantine/core';
import { Rehearsal as RehearsalPrisma } from '@prisma/client';
import { IconEdit } from '@tabler/icons';
import React from 'react';
import Button from '../button';
import RehearsalAttendence from './attendence';
import RehearsalForm from './form';

type RehearsalProps = {
  rehearsal: RehearsalPrisma;
};

const Rehearsal = ({ rehearsal }: RehearsalProps) => {
  const [opened, setOpened] = React.useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<h3>Uppdatera repa</h3>}
      >
        <RehearsalForm
          rehearsal={rehearsal}
          onSubmit={() => setOpened(false)}
        />
      </Modal>
      <div className='flex flex-col gap-2'>
        <h1>
          {rehearsal.title + ' (' + rehearsal.date.toLocaleDateString() + ')'}
        </h1>
        <Button
          className='bg-red-600'
          onClick={() => setOpened(true)}
          leftSection={<IconEdit />}
        >
          Redigera
        </Button>
        <RehearsalAttendence rehearsal={rehearsal} />
      </div>
    </>
  );
};

export default Rehearsal;
