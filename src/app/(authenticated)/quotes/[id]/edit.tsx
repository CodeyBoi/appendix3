import QuoteForm from 'components/quote/form';
import { api } from 'trpc/server';

const getQuote = async (id: string) => {
  if (id === 'new') {
    return null;
  }
  return await api.quote.get.query({ id });
};

const QuoteEdit = async ({ id }: { id: string }) => {
  const quote = await getQuote(id);
  const newQuote = quote === null;
  return newQuote ? <QuoteForm /> : <QuoteForm quote={quote} />;
};

export default QuoteEdit;
