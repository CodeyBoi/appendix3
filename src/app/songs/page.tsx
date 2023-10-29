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
    <div className='flex max-w-lg flex-col gap-4'>
      <div className='fixed left-0 top-0 mt-14 w-full max-w-lg px-6 py-2 lg:ml-72 lg:px-8'>
        <div className='flex items-center justify-between gap-4'>
          <div className='grow bg-white dark:bg-darkBg'>
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
