import type { Song } from '@prisma/client';
import { IconPencil } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Link from 'next/link';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

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
    return (
      <div>
        {lang('Denna sång finns tyvärr inte.', 'This song does not exist.')}
      </div>
    );
  }

  return (
    <div className='flex max-w-3xl flex-col'>
      <div className='flex flex-nowrap items-start gap-2'>
        <h3>{song.title}</h3>
        {isAdmin && (
          <Link href={`/admin/songs/${song.id}`}>
            <ActionIcon variant='subtle'>
              <IconPencil />
            </ActionIcon>
          </Link>
        )}
      </div>
      {song.melody && (
        <i>
          {lang('Melodi: ', 'Melody: ')}
          {song.melody}
        </i>
      )}
      {song.author && (
        <i>
          {lang('Skriven av: ', 'Written by: ')}
          {song.author}
        </i>
      )}
      <div className='h-4' />
      <div className='whitespace-pre-wrap'>{`${song.lyrics}`}</div>
    </div>
  );
};

export default Song;
