import TransactionsTable from 'app/admin/streck/view/transactions-table';
import Loading from 'components/loading';
import { Suspense } from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import OwnTransactionsTable from './table';

const StreckPage = async () => {
  const corps = await api.corps.getSelf.query();
  if (!corps) {
    return null;
  }
  return (
    <div>
      <h2>Senaste strecksaldohändelser</h2>
      <Suspense
        fallback={
          <Loading
            msg={lang('Hämtar transaktioner...', 'Fetching transactions...')}
          />
        }
      >
        <OwnTransactionsTable />
      </Suspense>
    </div>
  );
};

export default StreckPage;
