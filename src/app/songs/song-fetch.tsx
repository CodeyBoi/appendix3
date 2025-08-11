import SongList from './list';
import { api } from 'trpc/server';

const SongFetch = async () => {
  const [songs, pinnedSongs] = await Promise.all([
    api.song.getAll.query(),
    api.song.getPinned.query(),
  ]);
  return <SongList songs={songs} pinnedSongs={pinnedSongs} />;
};

export default SongFetch;
