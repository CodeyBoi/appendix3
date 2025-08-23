import Loading from 'components/loading';
import { Suspense } from 'react';
import { lang } from 'utils/language';
import StreckList from './table';

interface ViewStreckListPageProps {
  params: {
    id: string;
  };
}

const ViewStreckListPage = ({ params }: ViewStreckListPageProps) => {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return (
      <h3>
        {lang('Ogiltigt strecklistid: ', 'Invalid streck list id: ')}
        {params.id}
      </h3>
    );
  }

  return (
    <Suspense
      fallback={
        <Loading
          msg={lang('Hämtar strecklista...', 'Fetching streck list...')}
        />
      }
    >
      <div className='overflow-x-auto'>
        <StreckList id={id} />
      </div>
    </Suspense>
  );
};

export default ViewStreckListPage;
