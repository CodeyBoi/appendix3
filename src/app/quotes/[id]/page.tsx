import { Suspense } from 'react';
import QuoteEdit from './edit';
import Loading from 'components/loading';

const QuotePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const newQuote = id === 'new';
  return (
    <div className='flex max-w-sm flex-col gap-2'>
      <h2>{(newQuote ? 'Skapa' : 'Uppdatera') + ' citat'}</h2>
      <Suspense fallback={<Loading msg='Hämtar citat...' />}>
        <QuoteEdit id={id} />
      </Suspense>
    </div>
  );
};

export default QuotePage;
