import React, { useMemo } from 'react';
import {
  Table,
  Title,
  Stack,
  Group,
  Text,
  Button,
  ActionIcon,
  Card,
} from '@mantine/core';
import { trpc } from '../../utils/trpc';
import Loading from '../../components/loading';
import { NextLink } from '@mantine/next';
import { IconPencil } from '@tabler/icons';
import QuoteForm from '../../components/quote/form';

const getDayMessage = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const otherDate = new Date(date);
  otherDate.setHours(0, 0, 0, 0);
  const diff = today.getTime() - otherDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return 'Idag';
  } else if (diffDays === 1) {
    return 'Igår';
  } else if (diffDays === 2) {
    return 'I förrgår';
  } else {
    return `${otherDate.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;
  }
};

const Quotes = () => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const corpsId = corps?.id;

  const {
    data: quotes,
    isLoading: corpsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.quote.infiniteScroll.useInfiniteQuery(
    {},
    { getNextPageParam: (last) => last.nextCursor },
  );

  const loading = corpsLoading || !quotes;

  const quoteList = useMemo(() => {
    let prevDayMessage: string | undefined;
    return loading ? (
      <Loading msg='Laddar citat...' />
    ) : quotes && (quotes.pages[0]?.items.length ?? []) > 0 ? (
      <Table fontSize={16}>
        <tbody>
          {quotes.pages.map((page) => {
            {
              return page.items.map((quote) => {
                const { lastName, number } = quote.saidBy;
                const name = `${
                  number !== null ? '#' + number.toString() : 'p.e. ' + lastName
                }`;
                const ownQuote =
                  corpsId === quote.saidByCorpsId ||
                  corpsId === quote.writtenByCorpsId;
                const dayMessage = getDayMessage(new Date(quote.createdAt));
                let shouldAddDayMessage = false;
                if (prevDayMessage !== dayMessage) {
                  shouldAddDayMessage = true;
                  prevDayMessage = dayMessage;
                }
                return (
                  <React.Fragment key={quote.id}>
                    {shouldAddDayMessage && (
                      <tr style={{ backgroundColor: 'unset' }}>
                        <td colSpan={12}>
                          <Title mt={12} order={3}>
                            {dayMessage}
                          </Title>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>
                        <Group sx={{ alignItems: 'flex-start' }}>
                          <Text
                            pl={12}
                            sx={{
                              flex: '1',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {`${name}: `}
                            <i>{`${quote.quote}`}</i>
                          </Text>
                          {ownQuote && (
                            <ActionIcon
                              component={NextLink}
                              href={`/quotes/${quote.id}`}
                            >
                              <IconPencil />
                            </ActionIcon>
                          )}
                        </Group>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              });
            }
          })}
        </tbody>
      </Table>
    ) : (
      <Title sx={{ whiteSpace: 'nowrap' }} order={4}>
        Här fanns inget att se :/
      </Title>
    );
  }, [loading, quotes, corpsId]);

  return (
    <Stack sx={{ maxWidth: '800px' }}>
      <Title order={2}>Citat</Title>
      <QuoteForm />
      {quoteList}
      {hasNextPage && (
        <Group position='center'>
          <Button
            sx={{ width: 'min-content' }}
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            Ladda fler citat
          </Button>
        </Group>
      )}
    </Stack>
  );
};

export default Quotes;
