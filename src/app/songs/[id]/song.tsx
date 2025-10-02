import type { Song } from '@prisma/client';
import { IconDotsVertical } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Popover from 'components/popover';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import SongMenuContent from './menu';

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
  const song = await getSong(songProp);

  if (!song) {
    return (
      <div>
        {lang('Denna sång finns tyvärr inte.', 'This song does not exist.')}
      </div>
    );
  }

  await api.song.increaseViewCount.mutate({
    id: song.id,
  });

  return (
    <div className='flex max-w-xl flex-col'>
      <div className='flex flex-nowrap items-start gap-2'>
        <div className='grow'>
          <h3>{song.title}</h3>
        </div>
        <Popover
          closeOnClick
          position='left-bottom'
          target={
            <ActionIcon variant='subtle'>
              <IconDotsVertical />
            </ActionIcon>
          }
        >
          <SongMenuContent
            id={song.id}
            link={`${process.env.NEXTAUTH_URL}/songs/${encodeURIComponent(
              song.title.replaceAll(' ', '_'),
            )}`}
          />
        </Popover>
      </div>
      {song.melody && (
        <i>
          {lang('Melodi: ', 'Melody: ')}
          {song.melody}
        </i>
      )}
      <div className='h-4' />
      <div className='whitespace-pre-wrap leading-snug'>{song.lyrics}</div>
      {song.author && (
        <>
          <div className='h-4' />
          <i>
            {lang('Skriven av ', 'Written by ')}
            {song.author}
          </i>
        </>
      )}
    </div>
  );
};

export default Song;
