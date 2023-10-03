import { Corps, Rehearsal } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
import { trpc } from '../../utils/trpc';
import { Checkbox } from '@mantine/core';

type RehearsalAttendenceProps = {
  rehearsal: Rehearsal;
};

const RehearsalAttendence = ({ rehearsal }: RehearsalAttendenceProps) => {
  const start = dayjs(rehearsal?.date ?? new Date())
    .subtract(6, 'week')
    .startOf('week')
    .toDate();
  const end = dayjs(rehearsal?.date ?? new Date())
    .endOf('week')
    .toDate();
  const { data: activeCorps } = trpc.rehearsal.getActiveCorps.useQuery({
    start,
    end,
  });

  const makeCorpsCheckbox = (corps: Corps) => {
    const corpsName = `${corps.number !== null ? `#${corps.number}` : 'p.e.'} ${
      corps.firstName
    } ${corps.lastName}`;
    return <Checkbox key={corps.id} value={corps.id} label={corpsName} />;
  };
};

export default RehearsalAttendence;
