import { Suspense } from 'react';
import StreckListTable from '../strecklist-table';
import Loading from 'components/loading';
import { lang } from 'utils/language';

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
        <StreckListTable showDeleted showDelete />
      </Suspense>
    </div>
  );
};

export default ViewDeletedStreckListsPage;
