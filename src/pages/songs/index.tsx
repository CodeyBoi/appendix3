import { TextInput } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useMemo } from 'react';
import Loading from '../../components/loading';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { trpc } from '../../utils/trpc';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: 'api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

const Songs = () => {
  const [search, setSearch] = React.useState<string>('');

  const { data: songs, isLoading: songsLoading } = trpc.song.getAll.useQuery();

  const loading = songsLoading || !songs;

  const songList = useMemo(() => {
    let prevTitleLetter: string | undefined;
    return loading ? (
      <Loading msg='Ladataan kappaleita...' />
    ) : songs && songs.length > 0 ? (
      <div className='flex flex-col text-base divide-y divide-solid'>
        {songs.map((song) => {
          // Filter out songs that don't match the search
          if (
            search &&
            !song.title.toLowerCase().includes(search.toLowerCase())
          ) {
            return null;
          }
          const titleLetter = song.title[0]?.toUpperCase() ?? '';
          let shouldAddLetter = false;
          if (titleLetter !== prevTitleLetter) {
            prevTitleLetter = titleLetter;
            shouldAddLetter = true;
          }
          return (
            <React.Fragment key={song.id}>
              {shouldAddLetter && <h5 className='py-2 pl-3'>{titleLetter}</h5>}
              <Link href={`/songs/${song.id}`}>
                <div className='py-2 pl-6 cursor-pointer hover:bg-red-300/10'>
                  {song.title}
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    ) : (
      <h4 className='whitespace-pre-wrap'>Här fanns inget att se :/</h4>
    );
  }, [loading, songs, search]);

  return (
<<<<<<< HEAD
    <div className='flex flex-col max-w-lg gap-2'>
      <Head>
        <title>Sångboken</title>
      </Head>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex-grow'>
          <TextInput
            placeholder='Sök...'
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            icon={<IconSearch />}
          />
        </div>
        <Link href='/admin/songs/new'>
          <div className='p-1 text-white bg-red-600 rounded cursor-pointer w-min h-min hover:bg-red-700'>
=======
    <Stack sx={{ maxWidth: '500px' }}>
      <Group position='apart'>
        <TextInput
          placeholder='Hae...'
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          icon={<IconSearch />}
          sx={{ flex: '1' }}
        />
        {isAdmin && (
          <ActionIcon component={NextLink} href='/admin/songs/new'>
>>>>>>> 8a2c741 (Translated A LOT of the text to Finnish)
            <IconPlus />
          </div>
        </Link>
      </div>
      {songList}
    </div>
  );
};

export default Songs;
