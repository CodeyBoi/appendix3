import {
  Box,
  Button,
  Center,
  Group,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

const dateWhenTheNewBlindtarmenIsntNewAnymore = new Date('2023-03-01');

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
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
  return { props: {} };
};

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const theme = useMantineTheme();
  const isTheNewBlindtarmenStillNew =
    dateWhenTheNewBlindtarmenIsntNewAnymore > new Date();

  trpc.auth.checkIfEmailInUse.useQuery(email, {
    onSuccess: (data) => {
      if (data) {
        signIn('email', {
          email,
          redirect: true,
          callbackUrl: '/verified',
        });
        setSuccess(true);
      } else {
        setError('Denna mailadress är inte registrerad');
      }
    },
    enabled: !!email,
  });

  const numberInput = parseInt(email);
  trpc.auth.getEmailFromNumber.useQuery(numberInput, {
    onSuccess: (data) => {
      if (data) {
        signIn('email', {
          email: data,
          redirect: true,
          callbackUrl: '/verified',
        });
        setSuccess(true);
      } else {
        setError('Detta nummer är inte registrerat');
      }
    },
    enabled: !!numberInput && !isNaN(numberInput),
  });

  const onMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router, session]);

  return (
    <div
      style={{
        height: '100vh',
        background: theme.fn.linearGradient(
          215,
          theme?.colors?.red?.[7] || 'red',
          theme?.colors?.red?.[9] || 'darkred',
        ),
      }}
    >
      <Center>
        <Box
          sx={(theme) => ({
            marginTop: '35vh',
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
              marginTop: '25vh',
            },
          })}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail(e.currentTarget.email.value);
            }}
          >
            <div className='flex flex-col gap-2'>
              <h2 className='text-center text-white md:text-5xl'>
                {`Välkommen till ${isTheNewBlindtarmenStillNew ? 'nya ' : ''}`}
                <span style={{ color: theme?.colors?.red?.[5] }}>
                  Blindtarmen
                </span>
                !
              </h2>
              {!success && (
                <Group align='baseline'>
                  <TextInput
                    name='email'
                    spellCheck='false'
                    style={{ flexGrow: 1 }}
                    mx='sm'
                    size={onMobile ? 'lg' : 'xl'}
                    placeholder='Mailadress'
                    onChange={() => error && setError(null)}
                    onSubmit={(e) => setEmail(e.currentTarget.value)}
                    error={error}
                  />
                  <Button
                    mx='sm'
                    fullWidth={onMobile}
                    size={onMobile ? 'lg' : 'xl'}
                    type='submit'
                    variant='gradient'
                    gradient={{ from: 'red', to: 'darkred', deg: 185 }}
                  >
                    Logga in
                  </Button>
                </Group>
              )}
            </div>
          </form>
        </Box>
      </Center>
    </div>
  );
};
export default Login;
