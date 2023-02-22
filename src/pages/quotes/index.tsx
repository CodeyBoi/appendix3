import React, { useMemo } from 'react';
import {
  Table,
  Title,
  Stack,
  Group,
  Text,
  Button,
  ActionIcon,
} from '@mantine/core';
import { trpc } from '../../utils/trpc';
import Loading from '../../components/loading';
import { NextLink } from '@mantine/next';
import { IconPencil } from '@tabler/icons';

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
    // let prevTitleLetter: string | undefined;
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
                return (
                  <React.Fragment key={quote.id}>
                    {/* TODO: Group by day it was said */}
                    <tr>
                      <td>
                        <Group sx={{ alignItems: 'flex-start' }}>
                          <Text
                            pl={12}
                            sx={{ flex: '1', whiteSpace: 'pre-wrap' }}
                          >
                            {`${name}: `}
                            <i>{`${quote.quote}`}</i>
                          </Text>
                          {ownQuote && (
                            <ActionIcon
                              variant='filled'
                              color='red'
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
      <Group position='apart'>
        <Title order={2}>Citat</Title>
        <Button component={NextLink} href={`/quotes/new`}>
          Nytt citat
        </Button>
      </Group>
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
