'use client';

import TextInput from 'components/input/text-input';
import { IconPlus, IconSearch } from '@tabler/icons';
import Link from 'next/link';
import { useSearchParamsState } from 'hooks/use-search-params-state';

const SongSearch = () => {
  const [search, setSearch] = useSearchParamsState('search', '');
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex-grow bg-white dark:bg-darkBg'>
        <TextInput
          label='Sök...'
          defaultValue={search}
          onChange={setSearch}
          icon={<IconSearch />}
        />
      </div>
      <Link href='/admin/songs/new'>
        <div className='scale-150'>
          <div className='p-1 text-white bg-red-600 rounded cursor-pointer w-min h-min hover:bg-red-700'>
            <IconPlus />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SongSearch;
