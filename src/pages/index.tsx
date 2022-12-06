import { Title, Stack } from "@mantine/core";
import { Gig } from "@prisma/client";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import GigCard from "../components/gig/card";
import Loading from "../components/loading";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "api/auth/signin",
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
    const gigDate = gigs[0]?.date;
    const month = gigDate?.toLocaleDateString("sv-SE", { month: "long" });
    const year = gigDate?.getFullYear();
    return (
      <React.Fragment key={`${month} ${year}`}>
        <Title pt={6} order={3}>
          {`${month?.charAt(0)?.toUpperCase()}${month?.slice(1)}`}
        </Title>
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </React.Fragment>
    );
  });

  return gigList;
};

const Home: NextPage = () => {
  const currentDate = new Date(
    new Date().toISOString().split("T")[0] ?? "2021-01-01"
  );

  const { data: gigs, isLoading: gigsLoading } = trpc.gig.getMany.useQuery({
    startDate: currentDate,
  });

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <Title order={2}>
        {gigs && gigs.length === 0
          ? "Inga kommande spelningar :("
          : "Kommande spelningar"}
      </Title>
      {gigsLoading && <Loading msg="Laddar spelningar..." />}
      {gigs && makeGigList(gigs)}
    </Stack>
  );
};

export default Home;
