import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Loading from '../../../components/loading';
import SongView from '../../../components/song/view';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';
import { trpc } from '../../../utils/trpc';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: 'api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

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
