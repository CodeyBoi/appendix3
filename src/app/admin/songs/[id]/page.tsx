import SongForm from 'components/song/form';
import React from 'react';
import { api } from 'trpc/server';

const Song = async ({ searchParams }: { searchParams: { id: string } }) => {
  const id = searchParams.id;
  const newSong = id === 'new';
  const song = !newSong ? await api.song.get.query({ id }) : undefined;

  if (song === null) {
    return <h3>Sången finns inte.</h3>;
  }

  return (
    <div className='flex flex-col max-w-sm'>
      <h2>{(newSong ? 'Skapa' : 'Uppdatera') + ' sång'}</h2>
      <SongForm song={song} />
    </div>
  );
};

export default Song;
