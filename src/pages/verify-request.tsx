import { Center, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const unverifiedToken = ctx.req.cookies.unverifiedToken;
  const email = 'no email supplied yet (not working)'; //ctx.req.cookies.email;

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
  return { props: { unverifiedToken, email } };
};

const VerifyRequest = ({
  unverifiedToken,
  email,
}: {
  unverifiedToken: string;
  email: string;
}) => {
  const router = useRouter();
  const theme = useMantineTheme();

  const onMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

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
    <div
      style={{
        padding: 24,
        height: '100vh',
        background: theme.fn.linearGradient(
          215,
          theme?.colors?.red?.[7],
          theme?.colors?.red?.[9],
        ),
      }}
    >
      <Center>
        <div style={{ marginTop: onMobile ? '25vh' : '35vh' }}>
          <Title
            order={4}
            color='white'
            align='center'
            style={{ maxWidth: 800 }}
          >
            En inloggningslänk har skickats till din mailadress, när du klickat
            på den kan du återvända till denna flik.
          </Title>
        </div>
      </Center>
    </div>
  );
};

export default VerifyRequest;
