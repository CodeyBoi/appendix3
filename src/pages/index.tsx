import { Grid, Center, Group, Title, Accordion, Button, AppShell } from "@mantine/core";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import GigCalendar from "../components/gig/calendar";
import GigInfo from "../components/gig/info";
import AppendixHeader from "../components/header";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
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

const Home: NextPage = () => {

  const currentDate = new Date((new Date()).toISOString().split("T")[0]!);
  const { data: corps, status: corpsStatus } = trpc.corps.getCorps.useQuery();
  const { data: gigs } = trpc.gig.getMany.useQuery(
    { corpsId: corps?.id!, startDate: currentDate },
    { enabled: corpsStatus === 'success' }
  );

  return (
      <Grid sx={{ flexDirection: "row-reverse" }}>
        <Grid.Col xs={4} lg={3}>
          <Center>
            <GigCalendar gigs={gigs} />
          </Center>
        </Grid.Col>
        <Grid.Col xs={8} lg={9}>
          <Group position="apart">
            <Title order={1}>
              {gigs?.length === 0 ? 'Inga kommande spelningar :(' : 'Kommande spelningar'}
            </Title>
          </Group>
          <Accordion>
            {gigs?.map((gig) => (
              <React.Fragment key={gig.id}>
                <GigInfo gig={gig} inAccordion />
              </React.Fragment>
            ))}
          </Accordion>
        </Grid.Col>
      </Grid>
  );
}

export default Home;
