import { ActionIcon } from '@mantine/core';
import { Rehearsal } from '@prisma/client';
import { IconPlus } from '@tabler/icons';
import dayjs from 'dayjs';
import React from 'react';
import { trpc } from '../../utils/trpc';
import SelectCorps from '../select-corps';
import RehearsalCheckbox from './checkbox';

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
    <div className='flex flex-col space-y-2'>
      <h3>Närvaro</h3>
      <div className='flex space-x-2'>
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
      </div>
      <div className='flex flex-col space-y-2'>
        {attendence?.corpsiiBySection &&
          attendence.corpsiiBySection.map((section) => (
            <React.Fragment key={section.name}>
              <h4>{section.name}</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {section.corpsii.map((corps) => (
                  <RehearsalCheckbox
                    key={corps.id}
                    rehearsal={rehearsal}
                    corps={corps}
                    attended={corps.attended}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default RehearsalAttendence;
