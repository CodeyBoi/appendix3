import { Group, ActionIcon, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Quote } from '@prisma/client';
import { IconPencil } from '@tabler/icons';
import React from 'react';
import { trpc } from '../../utils/trpc';

interface QuoteProps {
  quote: Quote & {
    saidBy: {
      lastName: string;
      number: number | null;
    };
    writtenBy: { firstName: string; lastName: string; number: number | null };
  };
}

const Quote = ({ quote }: QuoteProps) => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const corpsId = corps?.id;
  const { lastName, number } = quote.saidBy;
  const saidByName = `${
    number !== null ? '#' + number.toString() : 'p.e. ' + lastName
  }`;
  const writtenByName = `${
    (quote.writtenBy.number !== null
      ? '#' + quote.writtenBy.number.toString()
      : 'p.e.') +
    ' ' +
    quote.writtenBy.firstName +
    ' ' +
    quote.writtenBy.lastName
  }`;
  const ownQuote =
    corpsId === quote.saidByCorpsId || corpsId === quote.writtenByCorpsId;
  const time = new Date(quote.createdAt).toLocaleString('sv-SE', {
    timeZone: 'Europe/Stockholm',
    hour: 'numeric',
    minute: 'numeric',
  });
  return (
    <Group sx={{ alignItems: 'flex-start' }}>
      <Text
        pl={12}
        sx={{
          flex: '1',
          whiteSpace: 'pre-wrap',
        }}
      >
        <Group spacing={0}>
          <Text sx={{ fontWeight: 'bold' }}>{writtenByName} </Text>
          <Text size='xs' sx={{ fontWeight: 'lighter', color: '#888888' }}>
            {time}
          </Text>
        </Group>
        {`${saidByName}: `}
        <i>{`${quote.quote}`}</i>
      </Text>
      {ownQuote && (
        <ActionIcon component={NextLink} href={`/quotes/${quote.id}`}>
          <IconPencil />
        </ActionIcon>
      )}
    </Group>
  );
};

export default Quote;
