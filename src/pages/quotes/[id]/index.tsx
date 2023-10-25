'use client';

import AlertError from 'components/alert-error';
import Loading from 'components/loading';
import QuoteForm from 'components/quote/form';
import { trpc } from 'utils/trpc';

const MAX_TRIES = 3;

const QuotePage = ({ params }: { params: { id: string } }) => {
  const quoteId = params.id;
  const newQuote = quoteId === 'new';

  const { data: quote, failureCount } = trpc.quote.get.useQuery(
    { id: quoteId ?? '' },
    {
      enabled: !newQuote && !!quoteId,
    },
  );

  return (
    <div className='flex flex-col max-w-sm gap-2'>
      <h2>{(newQuote ? 'Skapa' : 'Uppdatera') + ' citat'}</h2>
      {!newQuote && !quote && failureCount < MAX_TRIES && (
        <Loading msg='Laddar citat...' />
      )}
      {!newQuote && failureCount >= MAX_TRIES && (
        <AlertError msg='Kunde inte hämta citat. Har du mixtrat med URL:en?' />
      )}
      {!newQuote && quote && <QuoteForm quote={quote} />}
      {newQuote && <QuoteForm />}
    </div>
  );
};

export default QuotePage;
