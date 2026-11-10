import SongList from './list';
import { api } from 'trpc/server';

const SongFetch = async () => {
  const pinnedSongs = await api.song.getPinned.query();
  return <SongList pinnedSongs={pinnedSongs} />;
};

export default SongFetch;
