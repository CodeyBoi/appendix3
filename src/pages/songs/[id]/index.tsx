import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import SongView from '../../../components/song/view';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';
import { prisma } from '../../../server/db/client';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx);
  const songId = ctx.query.id as string;
  const song = await prisma?.song.findUnique({
    where: {
      id: songId,
    },
  });
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
      song: JSON.stringify(song),
    },
  };
};

const Song = ({
  song,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <SongView song={JSON.parse(song)} />;
};

export default Song;
