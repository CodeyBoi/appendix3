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
<<<<<<< HEAD
      </div>
      {song.melody && <i>{`Melodi: ${song.melody}`}</i>}
      {song.author && <i>{`Skriven av: ${song.author}`}</i>}
      <div className='h-4' />
      <div className='whitespace-pre-wrap'>{`${song.lyrics}`}</div>
    </div>
=======
      </Group>
      {song.melody && (
        <Text mt={6}>
          <i>{`Melodia: ${song.melody}`}</i>
        </Text>
      )}
      {song.author && (
        <Text>
          <i>{`Kirjoittanut: ${song.author}`}</i>
        </Text>
      )}
      <Text mt={12} sx={{ whiteSpace: 'pre-wrap' }}>{`${song.lyrics}`}</Text>
    </Stack>
>>>>>>> 8a2c741 (Translated A LOT of the text to Finnish)
  );
};

export default SongView;
