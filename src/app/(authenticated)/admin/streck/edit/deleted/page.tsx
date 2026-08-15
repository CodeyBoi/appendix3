import { Suspense } from 'react';
import StreckListTable from '../../strecklist-table';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import { api } from 'trpc/server';

const ViewDeletedStreckListsPage = async () => {
  return (
    <div className='flex flex-col gap-4'>
      <h2>Borttagna strecklistor</h2>
      <Suspense
        fallback={
          <Loading
            msg={lang(
              'Hämtar borttagna listor...',
              'Fetching deleted lists...',
            )}
          />
        }
      >
        <StreckListTable
          streckLists={await api.streck.getStreckLists.query({})}
          showDeleted
          showDelete
        />
      </Suspense>
    </div>
  );
};

export default ViewDeletedStreckListsPage;
