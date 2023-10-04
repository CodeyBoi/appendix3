import { Rehearsal } from '@prisma/client';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { trpc } from '../../utils/trpc';
import RehearsalCheckbox from './checkbox';
import { ActionIcon, Group, SimpleGrid, Stack, Title } from '@mantine/core';
import SelectCorps from '../select-corps';
import { IconPlus } from '@tabler/icons';

type RehearsalAttendenceProps = {
  rehearsal: Rehearsal;
};

const RehearsalAttendence = ({ rehearsal }: RehearsalAttendenceProps) => {
  const utils = trpc.useContext();

  const start = dayjs(rehearsal?.date ?? new Date())
    .subtract(6, 'week')
    .startOf('week')
    .toDate();
  const end = dayjs(rehearsal?.date ?? new Date())
    .endOf('week')
    .toDate();
  const [corpsId, setCorpsId] = React.useState('');

  const { data: activeCorps } =
    trpc.rehearsal.getAttendedRehearsalList.useQuery({
      id: rehearsal.id,
      start,
      end,
    });

  const mutation = trpc.rehearsal.updateAttendance.useMutation({
    onSuccess: () => {
      utils.rehearsal.getAttendedRehearsalList.invalidate({
        id: rehearsal.id,
        start,
        end,
      });
      setCorpsId('');
    },
  });

  const attendedCorpsIds = useMemo(
    () =>
      new Set(activeCorps?.filter((corps) => corps.attended).map((c) => c.id)),
    [activeCorps],
  );
  const selectedAlreadyAttendedCorps = attendedCorpsIds.has(corpsId);

  return (
    <Stack>
      <Title order={3}>Närvaro</Title>
      <Group position='left' align='start'>
        <SelectCorps
          error={
            selectedAlreadyAttendedCorps ? 'Corps har redan närvaro' : null
          }
          placeholder='Lägg till närvaro...'
          value={corpsId}
          onChange={(corpsId) => {
            if (!corpsId) return;
            setCorpsId(corpsId);
          }}
        />
        <ActionIcon
          onClick={() => {
            if (!corpsId) return;
            mutation.mutate({
              id: rehearsal.id,
              corpsId,
              attended: true,
            });
          }}
          loading={mutation.isLoading}
          disabled={selectedAlreadyAttendedCorps || !corpsId}
        >
          <IconPlus />
        </ActionIcon>
      </Group>

      {activeCorps && (
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
          ]}
          spacing={0}
          verticalSpacing={0}
        >
          {activeCorps.map((corps) => (
            <RehearsalCheckbox
              key={corps.id}
              rehearsal={rehearsal}
              corps={corps}
              attended={corps.attended}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default RehearsalAttendence;
