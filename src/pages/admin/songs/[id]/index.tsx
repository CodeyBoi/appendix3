import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../../utils/trpc';
import Loading from '../../../../components/loading';
import SongForm from '../../../../components/song/form';
import { Stack, Title } from '@mantine/core';
import AlertError from '../../../../components/alert-error';

const MAX_TRIES = 3;

const Song = () => {
  const router = useRouter();
  const songId = router.query.id as string | undefined;
  const newSong = songId === 'new';

  const { data: song, failureCount } = trpc.song.get.useQuery(
    { id: songId ?? '' },
    {
      enabled: !newSong && !!songId,
    },
  );

  return (
    <Stack align='flex-start' sx={{ maxWidth: '350px' }}>
      <Title order={2}>{(newSong ? 'Skapa' : 'Uppdatera') + ' sång'}</Title>
      {!newSong && !song && failureCount < MAX_TRIES && (
        <Loading msg='Laddar sång...' />
      )}
      {!newSong && failureCount >= MAX_TRIES && (
        <AlertError msg='Kunde inte hämta sång. Har du mixtrat med URL:en?' />
      )}
      {!newSong && song && <SongForm song={song} />}
      {newSong && <SongForm />}
    </Stack>
  );
};

export default Song;
