import { Button, Modal, Stack, Title } from '@mantine/core';
import { Rehearsal as RehearsalPrisma } from '@prisma/client';
import { IconEdit } from '@tabler/icons';
import React from 'react';
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
        title={<Title order={3}>Uppdatera repa</Title>}
      >
        <RehearsalForm
          rehearsal={rehearsal}
          onSubmit={() => setOpened(false)}
        />
      </Modal>
      <Stack>
        <h1>
          {rehearsal.title + ' (' + rehearsal.date.toLocaleDateString() + ')'}
        </h1>
        <Button
          className='bg-red-600'
          onClick={() => setOpened(true)}
          leftIcon={<IconEdit />}
        >
          Redigera
        </Button>
        <RehearsalAttendence rehearsal={rehearsal} />
      </Stack>
    </>
  );
};

export default Rehearsal;
