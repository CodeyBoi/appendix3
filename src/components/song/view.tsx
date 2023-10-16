import { Song } from '@prisma/client';
// import { trpc } from '../../utils/trpc';
import { IconPencil } from '@tabler/icons';
import Head from 'next/head';
import Link from 'next/link';

interface SongProps {
  song: Song;
}

const SongView = ({ song }: SongProps) => {
  // const { data: corps } = trpc.corps.getSelf.useQuery();
  // const isAdmin = corps?.role?.name === 'admin';
  const isAdmin = true; // Remove this when we move songs to admin
  return (
    <div className='flex flex-col max-w-3xl'>
      <Head>
        <title>{song.title}</title>
      </Head>
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
      {song.melody && <i>{`Melodia: ${song.melody}`}</i>}
      {song.author && <i>{`Kirjoittanut: ${song.author}`}</i>}
      <div className='h-4' />
      <div className='whitespace-pre-wrap'>{`${song.lyrics}`}</div>
    </div>
  );
};

export default SongView;
