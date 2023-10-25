import Loading from 'components/loading';
import Song from 'components/song';
import { Suspense } from 'react';
import { api } from 'trpc/server';

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const song = await api.song.get.query({ id: params.id });
  return song
    ? {
        title: song.title,
        description: song.lyrics,
      }
    : {
        title: 'Sång finns inte',
        description: 'Denna sång finns tyvärr inte.',
      };
};

const SongPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  return (
    <Suspense fallback={<Loading msg='Hämtar text...' />}>
      <Song song={id} />
    </Suspense>
  );
};

export default SongPage;
