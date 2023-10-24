import Loading from 'components/loading';
import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import SongView from '../../../components/song/view';

const Song = () => {
  const router = useRouter();
  const songId = router.query.id as string;
  const { data: song, isLoading } = trpc.song.get.useQuery({
    id: songId,
  });
  return (
    <>
      {isLoading && <Loading msg='Laddar sånger...' />}
      {song && <SongView song={song} />}
    </>
  );
};

export default Song;
