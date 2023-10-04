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
      typeId: rehearsal.typeId,
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

  const corpsBySections = useMemo(() => {
    if (!activeCorps) return null;
    const sectionMap = activeCorps.reduce((acc, corps) => {
      if (!corps.id) return acc;
      acc[corps.id] =
        corps.instruments.find((i) => i.isMainInstrument)?.instrument.name ??
        'Övrigt';
      return acc;
    }, {} as Record<string, string>);
    let lastSection = '';
    const result = activeCorps.reduce((acc, corps) => {
      if (!corps.id) return acc;
      const section = sectionMap[corps.id] ?? 'Övrigt';
      if (section !== lastSection) {
        acc.push({ name: section, corpsii: [] });
        lastSection = section;
      }
      acc[acc.length - 1]?.corpsii.push(corps);
      return acc;
    }, [] as { name: string; corpsii: typeof activeCorps }[]);
    return result;
  }, [activeCorps]);

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
        {corpsBySections &&
          corpsBySections.map((section) => (
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
