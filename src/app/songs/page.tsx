import { Metadata } from 'next';
import SongFetch from './song-fetch';
import { Suspense } from 'react';
import Loading from 'components/loading';
import ParamsTextInput from 'components/input/params-text-input';
import { IconSearch, IconMusicPlus } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';

export const metadata: Metadata = {
  title: 'Sångboken',
};

const SongsLayout = () => {
  return (
    <div className='flex flex-col max-w-lg gap-4'>
      <div className='fixed top-0 left-0 w-full max-w-lg px-6 py-2 lg:px-8 mt-14 lg:ml-72'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex-grow bg-white dark:bg-darkBg'>
            <ParamsTextInput
              label='Sök...'
              icon={<IconSearch />}
              paramName='search'
            />
          </div>
          <ActionIcon href='/admin/songs/new' variant='subtle'>
            <IconMusicPlus />
          </ActionIcon>
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
