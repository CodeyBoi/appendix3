import React from 'react';
import { Button, MediaQuery, Stack } from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import GigSignupBox from './signup-box';
import dayjs from 'dayjs';
import { Gig } from '@prisma/client';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';

interface GigButtonsProps {
  gig: Gig;
}

const GigButtons = ({ gig }: GigButtonsProps) => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === 'admin';

  const currentDate = dayjs().startOf('day');
  const showSignup =
    // Today is before the gig date
    currentDate.subtract(1, 'day').isBefore(gig.date, 'day') &&
    // There is no signup start date or today is after or at the signup start date
    (!gig.signupStart ||
      currentDate.add(1, 'day').isAfter(gig.signupStart, 'day')) &&
    // There is no signup end date or today is before or at the signup end date
    (!gig.signupEnd ||
      currentDate.subtract(1, 'day').isBefore(gig.signupEnd, 'day'));

  return (
    <MediaQuery smallerThan='md' styles={{ width: '100%' }}>
      <Stack>
        {showSignup && <GigSignupBox gigId={gig.id} />}
        {isAdmin && (
          <Button
            component={Link}
            href={`/admin/gig/${gig.id}`}
            leftIcon={<IconEdit />}
            fullWidth
          >
            Redigera spelning
          </Button>
        )}
      </Stack>
    </MediaQuery>
  );
};

export default GigButtons;
