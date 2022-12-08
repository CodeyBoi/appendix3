import {
  Button,
  Center,
  Group,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import React, { useEffect } from "react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const dateWhenTheNewBlindtarmenIsntNewAnymore = new Date("2023-03-01");

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  return { props: {} };
};

const Login = () => {
  const [email, setEmail] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const theme = useMantineTheme();
  const isBlindtarmenNew = dateWhenTheNewBlindtarmenIsntNewAnymore > new Date();

  trpc.auth.checkIfEmailInUse.useQuery(email, {
    onSuccess: (data) => {
      if (data) {
        signIn("email", { email });
      } else {
        setError("Denna mailadress är inte registrerad");
      }
    },
    enabled: !!email,
  });

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <div
      style={{
        height: "100vh",
        background: theme.fn.linearGradient(
          215,
          theme.colors.red[7],
          theme.colors.red[9]
        ),
      }}
    >
      <Center>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail(e.currentTarget.email.value);
          }}
          style={{ marginTop: isMobile ? "25vh" : "35vh" }}
        >
          <Stack>
            <Title order={isMobile ? 2 : 1} color="white" align="center">
              {`Välkommen till ${isBlindtarmenNew ? "nya " : ""}`}
              <span style={{ color: theme.colors.red[5] }}>Blindtarmen</span>!
            </Title>
            <Group align="baseline">
              <TextInput
                name="email"
                type="email"
                spellCheck="false"
                style={{ flexGrow: 1 }}
                mx="sm"
                size={isMobile ? "lg" : "xl"}
                placeholder="Mailadress"
                onChange={() => {
                  if (error) {
                    setError(null);
                  }
                }}
                onSubmit={(e) => setEmail(e.currentTarget.value)}
                error={error}
              />
              {/* TODO: Add loading spinner when loading */}
              <Button
                mx="sm"
                fullWidth={isMobile}
                size={isMobile ? "lg" : "xl"}
                type="submit"
                variant="gradient"
                gradient={{ from: "red", to: "darkred", deg: 185 }}
              >
                Logga in
              </Button>
            </Group>
          </Stack>
        </form>
      </Center>
    </div>
  );
};

export default Login;
