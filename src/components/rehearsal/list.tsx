import { Stack, Card, Group, Text } from '@mantine/core';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';

type Rehearsal = {
  id: string;
  date: Date;
  title: string;
};
type RehearsalsProps = {
  rehearsals: Rehearsal[];
};

const RehearsalList = ({ rehearsals }: RehearsalsProps) => {
  return (
    <>
      <Stack spacing='xs'>
        {rehearsals?.map((rehearsal) => (
          <Card
            key={rehearsal.id}
            shadow='sm'
            component={Link}
            href={`/admin/rehearsal/${rehearsal.id}`}
          >
            <Group position='left'>
              <Text>{dayjs(rehearsal.date).format('YYYY-MM-DD')}</Text>
              <Text>{rehearsal.title}</Text>
            </Group>
          </Card>
        ))}
      </Stack>
      {rehearsals && rehearsals.length === 0 && (
        <Text>Inga rep finns registrerade detta år</Text>
      )}
    </>
  );
};

export default RehearsalList;
