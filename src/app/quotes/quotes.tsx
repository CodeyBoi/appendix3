'use client';

import React from 'react';
import QuoteForm from 'components/quote/form';
import { trpc } from 'utils/trpc';
import Button from 'components/input/button';
import { Metadata } from 'next';
import QuotePage from './list';

export const metadata: Metadata = {
  title: 'Citat',
};

const Quotes = () => {
  const {
    data: quotes,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.quote.infiniteScroll.useInfiniteQuery(
    {},
    { getNextPageParam: (last) => last.nextCursor },
  );

  return (
    <div className='flex flex-col max-w-xl gap-2'>
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
