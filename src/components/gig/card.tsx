import {
  Title,
  Text,
  Stack,
  Group,
  Card,
  UnstyledButton,
  Grid,
  Modal,
} from '@mantine/core';
import React from 'react';
import Datebox from './datebox';
import dayjs from 'dayjs';
import { Gig } from '@prisma/client';
import { NextLink } from '@mantine/next';
import GigMenu from './menu';
import { trpc } from '../../utils/trpc';
import GigForm from './form';
import GigSignupBox from './signup-box';

interface GigCardProps {
  gig: Gig & { type: { name: string } } & { hiddenFor: { corpsId: string }[] };
}

const GigCard = ({ gig }: GigCardProps) => {
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

  return (
    <>
      <Modal
        title={<Title order={3}>Uppdatera spelning</Title>}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <GigForm gig={gig} onSubmit={() => setOpened(false)} />
      </Modal>
      <Card shadow='sm' p='md' withBorder style={{ overflow: 'visible' }}>
        <Stack spacing='sm'>
          <Stack spacing={0}>
            <Group position='apart' align='flex-start'>
              <UnstyledButton component={NextLink} href={`/gig/${gig.id}`}>
                <Title order={5}>{gig.title}</Title>
              </UnstyledButton>
              <GigMenu gig={gig} isAdmin={isAdmin} setOpened={setOpened} />
            </Group>
            <Grid grow>
              <Grid.Col span={12} md={8}>
                <UnstyledButton
                  component={NextLink}
                  href={`/gig/${gig.id}`}
                  style={{ flexGrow: 1 }}
                >
                  <Group position='left'>
                    <Datebox date={dayjs(gig.date)} />
                    <Text size='xs'>
                      <i>{gig.type.name}</i>
                      <br />
                      {gig.location && `${gig.location}`}
                      {gig.location && <br />}
                      {gig.meetup && `Samling: ${gig.meetup}`}
                      {gig.meetup && <br />}
                      {gig.start && `Spelstart: ${gig.start}`}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Grid.Col>
              <Grid.Col span={12} md={4}>
                {showSignup && (
                  <GigSignupBox
                    gigId={gig.id}
                    checkbox1={gig.checkbox1}
                    checkbox2={gig.checkbox2}
                  />
                )}
              </Grid.Col>
            </Grid>
          </Stack>
          <Text size='sm'>{gig.description}</Text>
        </Stack>
      </Card>
    </>
  );
};

export default GigCard;
