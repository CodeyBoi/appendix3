import { Grid, Center, Group, Title, Accordion } from "@mantine/core";
import { Gig } from "@prisma/client";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import GigCalendar from "../components/gig/calendar";
import GigInfo from "../components/gig/info";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
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

const monthNames = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

const makeGigList = (gigs: (Gig & { type: { name: string } })[]) => {
  let lastMonth = -1;

  const gigsByMonth = gigs.reduce((acc, gig) => {
    const month = gig.date.getMonth();
    const newMonth = month !== lastMonth;
    lastMonth = month;
    if (newMonth) {
      acc.push([]);
    }
    acc.at(-1)?.push(gig);
    return acc;
  }, [] as (Gig & { type: { name: string } })[][]);

  const gigList = gigsByMonth.map((gigs) => {
    const month = gigs[0]?.date.getMonth() ?? -1;
    return (
      <>
        <Title order={2}>
          <u>{monthNames[month]}</u>
        </Title>
        <Accordion key={month}>
          {gigs.map((gig) => (
            <GigInfo key={gig.id} gig={gig} inAccordion />
          ))}
        </Accordion>
      </>
    );
  });

  return gigList;
};

const Home: NextPage = () => {
  const currentDate = new Date(
    new Date().toISOString().split("T")[0] ?? "2021-01-01"
  );

  const { data: gigs } = trpc.gig.getMany.useQuery(
    { startDate: currentDate },
  );

  console.log(gigs);

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
            {gigs && gigs.length === 0
              ? "Inga kommande spelningar :("
              : "Kommande spelningar"}
          </Title>
        </Group>
        {gigs && makeGigList(gigs)}
      </Grid.Col>
    </Grid>
  );
};

export default Home;
