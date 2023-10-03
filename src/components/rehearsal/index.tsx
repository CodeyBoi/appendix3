import React from 'react';
import { Rehearsal as RehearsalPrisma } from '@prisma/client';
import { Button, Modal, Stack, Title } from '@mantine/core';
import RehearsalForm from './form';
import { IconEdit } from '@tabler/icons';
import RehearsalAttendence from './attendence';

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
        centered
        size='auto'
        transition='rotate-left'
        transitionDuration={200}
        zIndex={1000}
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
        <Button onClick={() => setOpened(true)} leftIcon={<IconEdit />}>
          Redigera repa
        </Button>
        <RehearsalAttendence rehearsal={rehearsal} />
      </Stack>
    </>
  );
};

export default Rehearsal;
