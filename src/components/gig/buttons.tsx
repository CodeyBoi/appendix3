import React from 'react';
import { Button, MediaQuery, Stack } from '@mantine/core';
import { IconCalendarPlus, IconEdit } from '@tabler/icons';
import GigSignupBox from './signup-box';
import dayjs from 'dayjs';
import { Gig } from '@prisma/client';
import { NextLink } from '@mantine/next';
import { trpc } from '../../utils/trpc';

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

  const hasValidTimes = gig.meetup.includes(':') && gig.start.includes(':');

  const generateCalendarLink = () => {
    if (!hasValidTimes) return '';
    const [meetupHour, meetupMinute] = gig.meetup.split(':');
    const [startHourTemp, startMinute] = gig.start.split(':');
    if (!meetupHour || !meetupMinute || !startHourTemp || !startMinute)
      return '';
    const afterEleven = parseInt(startHourTemp) === 23;
    const startHour = afterEleven
      ? '00'
      : (parseInt(startHourTemp) + 1).toString();
    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      gig.title,
    )}&dates=${dayjs(gig.date).format(
      'YYYYMMDD',
    )}T${meetupHour}${meetupMinute}00/${dayjs(gig.date)
      .add(afterEleven ? 1 : 0, 'day')
      .format(
        'YYYYMMDD',
      )}T${startHour}${startMinute}00&details=${encodeURIComponent(
      gig.description,
    )}&location=${encodeURIComponent(gig.location)}`;
    return calendarLink;
  };

  return (
    <MediaQuery smallerThan='md' styles={{ width: '100%' }}>
      <Stack spacing={6}>
        {showSignup && <GigSignupBox gigId={gig.id} />}
        {hasValidTimes && (
          <Button
            component='a'
            href={generateCalendarLink()}
            target='_blank'
            leftIcon={<IconCalendarPlus />}
            fullWidth
          >
            Lägg till i kalender
          </Button>
        )}
        {isAdmin && (
          <Button
            component={NextLink}
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
