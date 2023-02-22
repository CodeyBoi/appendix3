import React from 'react';
import Loading from '../../../components/loading';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import QuoteForm from '../../../components/quote/form';
import { Stack, Title } from '@mantine/core';
import AlertError from '../../../components/alert-error';

const MAX_TRIES = 3;

const Quote = () => {
  const router = useRouter();
  const quoteId = router.query.id as string | undefined;
  const newQuote = quoteId === 'new';

  const { data: quote, failureCount } = trpc.quote.get.useQuery(
    { id: quoteId ?? '' },
    {
      enabled: !newQuote && !!quoteId,
    },
  );

  return (
    <Stack align='flex-start' sx={{ maxWidth: '350px' }}>
      <Title order={2}>{(newQuote ? 'Skapa' : 'Uppdatera') + ' citat'}</Title>
      {!newQuote && !quote && failureCount < MAX_TRIES && (
        <Loading msg='Laddar citat...' />
      )}
      {!newQuote && failureCount >= MAX_TRIES && (
        <AlertError msg='Kunde inte hämta citat. Har du mixtrat med URL:en?' />
      )}
      {!newQuote && quote && <QuoteForm quote={quote} />}
      {newQuote && <QuoteForm />}
    </Stack>
  );
};

export default Quote;
