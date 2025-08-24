import Loading from 'components/loading';
import { Suspense } from 'react';
import { lang } from 'utils/language';
import TransactionsTable from 'app/account/streck/table';
import { api } from 'trpc/server';
import { Language } from 'hooks/use-language';

interface StreckAccountPageProps {
  params: {
    id: string;
  };
}

const getData = async (corpsId: string) => {
  const [corps, account] = await Promise.all([
    api.corps.getSelf.query(),
    api.streck.getStreckAccount.query({ corpsId }),
  ]);
  return {
    transactions: account.transactions,
    locale: corps.language as Language,
  };
};

const StreckAccountPage = async ({ params }: StreckAccountPageProps) => {
  return (
    <div>
      <h2>{lang('Strecksaldo', 'Streck balance')}</h2>
      <Suspense fallback={<Loading msg={lang('Hämtar...', 'Fetching...')} />}>
        <TransactionsTable {...await getData(params.id)} />
      </Suspense>
    </div>
  );
};

export default StreckAccountPage;
