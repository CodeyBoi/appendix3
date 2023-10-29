'use client';

import React from 'react';
import QuoteForm from 'components/quote/form';
import Button from 'components/input/button';
import { Metadata } from 'next';
import QuotePage from './list';
import { api } from 'trpc/react';

export const metadata: Metadata = {
  title: 'Citat',
};

const Quotes = () => {
  const {
    data: quotes,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.quote.infiniteScroll.useInfiniteQuery(
    {},
    { getNextPageParam: (last) => last.nextCursor },
  );

  return (
    <div className='flex max-w-xl flex-col gap-2'>
      <h2>Citat</h2>
      <QuoteForm />
      {quotes?.pages.map((page) => (
        <QuotePage key={page.items[0]?.id} quotes={page.items} />
      ))}
      {hasNextPage && (
        <div className='flex justify-center'>
          <Button
            className='w-min'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Ladda fler citat
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quotes;
