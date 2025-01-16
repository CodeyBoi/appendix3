import Loading from 'components/loading';
import { Suspense } from 'react';
import { lang } from 'utils/language';
import OwnTransactionsTable from './table';

const StreckPage = () => {
  return (
    <div>
      <h2>{lang('Strecksaldo', 'Streck balance')}</h2>
      <Suspense fallback={<Loading msg={lang('Hämtar...', 'Fetching...')} />}>
        <OwnTransactionsTable />
      </Suspense>
    </div>
  );
};

export default StreckPage;
