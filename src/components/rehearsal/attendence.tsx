import { Rehearsal } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
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

  const { data: attendence } = trpc.rehearsal.getAttendedRehearsalList.useQuery(
    {
      id: rehearsal.id,
      start,
      end,
      typeId: rehearsal.typeId,
    },
  );

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

  const selectedAlreadyAttendedCorps = attendence?.corpsIds.has(corpsId);

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
      <Stack spacing='xs'>
        {attendence?.corpsiiBySection &&
          attendence.corpsiiBySection.map((section) => (
            <React.Fragment key={section.name}>
              <Title order={4}>{section.name}</Title>
              <SimpleGrid
                ml='md'
                cols={1}
                breakpoints={[
                  { minWidth: 'md', cols: 2 },
                  { minWidth: 'lg', cols: 3 },
                ]}
                spacing={0}
                verticalSpacing={0}
              >
                {section.corpsii.map((corps) => (
                  <RehearsalCheckbox
                    key={corps.id}
                    rehearsal={rehearsal}
                    corps={corps}
                    attended={corps.attended}
                  />
                ))}
              </SimpleGrid>
            </React.Fragment>
          ))}
      </Stack>
    </Stack>
  );
};

export default RehearsalAttendence;
