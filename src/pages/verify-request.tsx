import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const unverifiedToken = ctx.req.cookies.unverifiedToken;

  const session = await getServerAuthSession(ctx);
  // Redirects to home if user is already logged in
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
  return { props: { unverifiedToken } };
};

const VerifyRequest = ({ unverifiedToken }: { unverifiedToken: string }) => {
  const router = useRouter();

  trpc.auth.checkVerified.useQuery(unverifiedToken, {
    refetchOnMount: true,
    refetchInterval: 1000,
    onSuccess: (data) => {
      if (data) {
        router.reload();
      }
    },
  });
  return (
    <div className='flex items-center justify-center h-screen polka'>
      <div className='p-4 bg-red-600 rounded shadow-2xl'>
        <h4 className='max-w-3xl text-center text-white'>
          En inloggningslänk har skickats till din mailadress, när du klickat på
          den kan du återvända till denna flik.
        </h4>
      </div>
    </div>
  );
};

export default VerifyRequest;
