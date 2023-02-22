import React from 'react';
import Loading from '../../../components/loading';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import SongView from '../../../components/song/view';

const Song = () => {
  const router = useRouter();
  const songId = router.query.id as string;
  const { data: song, status: songStatus } = trpc.song.get.useQuery({
    id: songId,
  });
  const loading = songStatus === 'loading';
  return (
    <>
      {loading && <Loading msg='Laddar sång...' />}
      {song && <SongView song={song} />}
    </>
  );
};

export default Song;
