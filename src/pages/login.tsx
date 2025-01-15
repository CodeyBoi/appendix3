'use client';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getServerAuthSession } from 'server/common/get-server-auth-session';
import { trpc } from 'utils/trpc';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import { IconMail } from '@tabler/icons-react';

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
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const isTheNewBlindtarmenStillNew =
    dateWhenTheNewBlindtarmenIsntNewAnymore > new Date();

  trpc.auth.checkIfEmailInUse.useQuery(email, {
    onSuccess: (data) => {
      if (data) {
        void signIn('email', {
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
        void signIn('email', {
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

  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router, session]);

  return (
    <div className='polka fixed left-0 top-0 flex h-screen w-screen items-center justify-center font-display'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setEmail(data.get('email') as string);
        }}
      >
        <div className='flex flex-col items-center gap-6 rounded bg-red-600 p-4 shadow-2xl'>
          <h2 className='text-center text-white md:text-5xl'>
            {`Välkommen till ${isTheNewBlindtarmenStillNew ? 'nya ' : ''}`}
            <span className='text-red-400'>Blindtarmen</span>!
          </h2>
          {!success && (
            <div className='w-4/5 scale-125 lg:w-2/3 lg:scale-150'>
              <div className='flex w-full gap-2 p-2 max-lg:flex-col'>
                <div className='grow'>
                  <TextInput
                    variant='login'
                    className='text-white placeholder:text-white'
                    icon={
                      <span className='text-white'>
                        <IconMail />
                      </span>
                    }
                    name='email'
                    spellCheck='false'
                    label='Mailadress (eller #)'
                    onChange={() => {
                      if (error) {
                        setError(undefined);
                      }
                    }}
                    onSubmit={(e) => {
                      setEmail(e.currentTarget.value);
                    }}
                    error={error}
                    errorColor='white'
                  />
                </div>
                <Button className='shrink border border-white' type='submit'>
                  Logga in
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
export default Login;
