import Loading from 'components/loading';
import Song from 'components/song';
import { Suspense } from 'react';

const SongPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  return (
    <Suspense fallback={<Loading msg='Hämtar text...' />}>
      <Song song={id} />
    </Suspense>
  );
};

export default SongPage;
