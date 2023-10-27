import React from 'react';
import { Button, MediaQuery, Modal, Stack, Title } from '@mantine/core';
import { IconCalendarPlus, IconEdit } from '@tabler/icons-react';
import GigSignupBox from './signup-box';
import dayjs from 'dayjs';
import { Gig } from '@prisma/client';
import { trpc } from '../../utils/trpc';
import GigForm from './form';

interface GigButtonsProps {
  gig: Gig & { type: { name: string } } & { hiddenFor: { corpsId: string }[] };
}

const GigButtons = ({ gig }: GigButtonsProps) => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === 'admin';

  const [opened, setOpened] = React.useState(false);

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

  const hasValidTimes =
    (gig.meetup.includes(':') || gig.meetup.includes('.')) &&
    (gig.start.includes(':') || gig.start.includes('.'));

  const generateCalendarLink = () => {
    if (!hasValidTimes) return '';
    const [meetupHour, meetupMinute] = gig.meetup.split(/[:.]/);
    const [startHourTemp, startMinute] = gig.start.split(/[:.]/);
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
      <>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={<Title order={3}>Uppdatera spelning</Title>}
          centered
          size='auto'
          transition='rotate-left'
          transitionDuration={200}
          zIndex={1000}
        >
          <GigForm gig={gig} onSubmit={() => setOpened(false)} />
        </Modal>
        <Stack spacing={6}>
          {showSignup && (
            <GigSignupBox
              gigId={gig.id}
              checkbox1={gig.checkbox1}
              checkbox2={gig.checkbox2}
            />
          )}
          {hasValidTimes && (
            <Button
              component='a'
              href={generateCalendarLink()}
              target='_blank'
              leftIcon={<IconCalendarPlus />}
              fullWidth
            >
              Lisää kalenteriin
            </Button>
          )}
          {isAdmin && (
            <Button
              onClick={() => setOpened(true)}
              leftIcon={<IconEdit />}
              fullWidth
            >
              Muokkaa toistoa
            </Button>
          )}
        </Stack>
      </>
    </MediaQuery>
  );
};

export default GigButtons;
