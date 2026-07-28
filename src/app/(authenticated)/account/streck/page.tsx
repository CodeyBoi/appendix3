import Loading from 'components/loading';
import { Suspense } from 'react';
import { lang } from 'utils/language';
import TransactionsTable from './table';
import { api } from 'trpc/server';
import { Language } from 'hooks/use-language';

const getData = async () => {
  const [corps, account] = await Promise.all([
    api.corps.getSelf.query(),
    api.streck.getOwnStreckAccount.query(),
  ]);
  return {
    transactions: account.transactions,
    locale: corps.language as Language,
  };
};

const StreckPage = async () => {
  return (
    <div>
      <h2>{lang('Strecksaldo', 'Streck balance')}</h2>
      <Suspense fallback={<Loading msg={lang('Hämtar...', 'Fetching...')} />}>
        <TransactionsTable {...await getData()} />
      </Suspense>
    </div>
  );
};

export default StreckPage;
