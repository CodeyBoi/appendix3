import { useRouter } from 'next/router';
import AlertError from '../../../../components/alert-error';
import Loading from '../../../../components/loading';
import SongForm from '../../../../components/song/form';
import { trpc } from '../../../../utils/trpc';

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
    <div className='flex flex-col max-w-sm'>
      <h2>{(newSong ? 'Skapa' : 'Uppdatera') + ' sång'}</h2>
      {!newSong && !song && failureCount < MAX_TRIES && (
        <Loading msg='Laddar sång...' />
      )}
      {!newSong && failureCount >= MAX_TRIES && (
        <AlertError msg='Kunde inte hämta sång. Har du mixtrat med URL:en?' />
      )}
      {!newSong && song && <SongForm song={song} />}
      {newSong && <SongForm />}
    </div>
  );
};

export default Song;
