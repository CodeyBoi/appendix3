import { Button, Center, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

const VerifyRequest = () => {
  const theme = useMantineTheme();

  const onMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <div
      style={{
        height: '100vh',
        background: theme.fn.linearGradient(
          215,
          theme?.colors?.red?.[7],
          theme?.colors?.red?.[9]
        ),
      }}
    >
      <Center>
        <div style={{ marginTop: onMobile ? '25vh' : '35vh' }}>
          <Title order={4} color='white' align='center'>
            Din inloggning har blivit verifierad och du kan nu återgå till
            appen.
            <br />
            Eller klicka på länken nedan för att komma direkt till appen.
          </Title>
          <Center>
            <Button style={{ marginTop: 12 }} component={NextLink} href='/'>
              Till startsidan
            </Button>
          </Center>
        </div>
      </Center>
    </div>
  );
};

export default VerifyRequest;
