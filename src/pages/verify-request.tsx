import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const token = ctx.req.cookies.token;
  const email = ctx.req.cookies.email;

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
  return { props: { token } };
};

const VerifyRequest = ({ token }: { token: string }) => {
  trpc.auth.checkVerified.useQuery(token, {
    onSuccess: (data) => {
      if (data) {
        console.log(data);
      }
    },
  });
  return <div>Verify Request</div>;
};

export default VerifyRequest;
