import SongForm from 'app/songs/[id]/form';
import React from 'react';
import { api } from 'trpc/server';

const Song = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const newSong = id === 'new';
  const song = !newSong ? await api.song.get.query({ id }) : undefined;

  if (song === null) {
    return <h3>Sången finns inte.</h3>;
  }

  return (
    <div className='flex max-w-sm flex-col'>
      <h2>{(newSong ? 'Skapa' : 'Uppdatera') + ' sång'}</h2>
      <SongForm song={song} />
    </div>
  );
};

export default Song;
