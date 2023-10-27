import { Button, Table } from '@mantine/core';
import Head from 'next/head';
import React, { useMemo } from 'react';
import Loading from '../../components/loading';
import Quote from '../../components/quote';
import QuoteForm from '../../components/quote/form';
import { trpc } from '../../utils/trpc';

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
    ) : quotes && (quotes.pages[0]?.items ?? []).length > 0 ? (
      <Table fontSize={16}>
        <tbody>
          {quotes.pages.map((page) => {
            {
              return page.items.map((quote) => {
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
                          <h3 className='mt-3'>{dayMessage}</h3>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ border: '0' }}>
                        <Quote quote={quote} />
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
      <h4 className='whitespace-nowrap'>Här fanns inget att se :/</h4>
    );
  }, [loading, quotes]);

  return (
    <div className='flex flex-col max-w-xl gap-2'>
      <Head>
        <title>Sitaatit</title>
      </Head>
      <h2>Sitaatit</h2>
      <QuoteForm />
      {quoteList}
      {hasNextPage && (
        <div className='flex justify-center'>
          <Button
            className='bg-red-600'
            sx={{ width: 'min-content' }}
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            Ladda fler citat
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quotes;
