import { Song } from '@prisma/client';
// import { trpc } from '../../utils/trpc';
import { IconPencil } from '@tabler/icons-react';
import Link from 'next/link';
import { api } from 'trpc/server';

interface SongProps {
  song: Song | string;
}

const getSong = async (song: Song | string) => {
  if (typeof song === 'string') {
    return api.song.get.query({ id: song });
  }
  return song;
};

const Song = async ({ song: songProp }: SongProps) => {
  // const { data: corps } = trpc.corps.getSelf.useQuery();
  // const isAdmin = corps?.role?.name === 'admin';
  const isAdmin = true; // Remove this when we move songs to admin
  const song = await getSong(songProp);

  if (!song) {
    return <div>Denna sång finns tyvärr inte.</div>;
  }

  return (
    <div className='flex flex-col max-w-3xl'>
      <div className='flex justify-between flex-nowrap'>
        <h3>{song.title}</h3>
        {isAdmin && (
          <Link href={`/admin/songs/${song.id}`}>
            <div className='p-1 text-white bg-red-600 rounded cursor-pointer w-min h-min hover:bg-red-700'>
              <IconPencil />
            </div>
          </Link>
        )}
      </div>
      {song.melody && <i>{`Melodi: ${song.melody}`}</i>}
      {song.author && <i>{`Skriven av: ${song.author}`}</i>}
      <div className='h-4' />
      <div className='whitespace-pre-wrap'>{`${song.lyrics}`}</div>
    </div>
  );
};

export default Song;
