import SongList from './list';
import { api } from 'trpc/server';

const SongFetch = async () => {
  const songs = await api.song.getAll.query();
  return <SongList songs={songs} />;
};

export default SongFetch;
