import { Corps, Rehearsal } from '@prisma/client';
import React from 'react';
import { trpc } from '../../utils/trpc';
import FormLoadingOverlay from '../form-loading-overlay';
import Checkbox from 'components/input/checkbox';

type RehearsalCheckboxProps = {
  rehearsal: Rehearsal;
  corps: Corps;
  attended: boolean;
};

const RehearsalCheckbox = ({
  rehearsal,
  corps,
  attended,
}: RehearsalCheckboxProps) => {
  const utils = trpc.useUtils();
  const mutation = trpc.rehearsal.updateAttendance.useMutation({
    onSuccess: () => {
      utils.rehearsal.getAttendence.invalidate({
        id: rehearsal.id,
        corpsId: corps.id,
      });
    },
  });

  const corpsName = `${corps.number !== null ? `#${corps.number}` : 'p.e.'} ${
    corps.firstName
  } ${corps.lastName}`;
  return (
    <FormLoadingOverlay visible={mutation.isLoading}>
      <Checkbox
        label={corpsName}
        defaultChecked={attended}
        onChange={(e) => {
          mutation.mutate({
            id: rehearsal.id,
            corpsId: corps.id,
            attended: e.currentTarget.checked,
          });
        }}
      />
    </FormLoadingOverlay>
  );
};

export default RehearsalCheckbox;
