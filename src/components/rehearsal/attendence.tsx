'use client';

import { Rehearsal } from '@prisma/client';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React from 'react';
import SelectCorps from 'components/select-corps';
import RehearsalCheckbox from 'components/rehearsal/checkbox';
import { api } from 'trpc/react';

interface RehearsalAttendenceProps {
  rehearsal: Rehearsal;
}

const RehearsalAttendence = ({ rehearsal }: RehearsalAttendenceProps) => {
  const utils = api.useUtils();

  const start = dayjs(rehearsal.date)
    .subtract(6, 'week')
    .startOf('week')
    .toDate();
  const end = dayjs(rehearsal.date).endOf('week').toDate();
  const [corpsId, setCorpsId] = React.useState('');

  const { data: attendence } = api.rehearsal.getAttendedRehearsalList.useQuery({
    id: rehearsal.id,
    start,
    end,
    typeId: rehearsal.typeId,
  });

  const mutation = api.rehearsal.updateAttendance.useMutation({
    onSuccess: async () => {
      await utils.rehearsal.getAttendedRehearsalList.invalidate({
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
            selectedAlreadyAttendedCorps ? 'Corps har redan närvaro' : undefined
          }
          placeholder='Lägg till närvaro...'
          value={corpsId}
          onChange={(corpsId) => {
            if (!corpsId) return;
            setCorpsId(corpsId);
          }}
        />
        <button
          className='rounded p-1 text-red-600 transition-colors hover:bg-red-600/10'
          onClick={() => {
            if (!corpsId) return;
            mutation.mutate({
              id: rehearsal.id,
              corpsId,
              attended: true,
            });
          }}
          disabled={
            selectedAlreadyAttendedCorps || !corpsId || mutation.isLoading
          }
        >
          <IconPlus />
        </button>
      </div>
      <div className='flex flex-col space-y-2'>
        {attendence?.corpsiiBySection.map((section) => (
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
