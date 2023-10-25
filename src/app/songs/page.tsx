import SongSearch from './search';
import { Metadata } from 'next';
import SongFetch from './song-fetch';
import { Suspense } from 'react';
import Loading from 'components/loading';

export const metadata: Metadata = {
  title: 'Sångboken',
};

const SongsLayout = () => {
  return (
    <div className='flex flex-col max-w-lg gap-4'>
      <div className='fixed top-0 left-0 w-full max-w-lg px-2 py-2 lg:px-8 mt-14 lg:ml-72'>
        <div className='bg-white'>
          <SongSearch />
        </div>
      </div>
      <div className='mt-8'>
        <Suspense fallback={<Loading msg='Hämtar sånger...' />}>
          <SongFetch />
        </Suspense>
      </div>
    </div>
  );
};

export default SongsLayout;
