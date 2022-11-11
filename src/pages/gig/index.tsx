import React from "react";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import GigInfo from "../../components/gig/info";

const Gigs: NextPage = () => {
  const { data: gigs } = trpc.gig.getMany.useQuery({});

  return (
    <>
      {gigs?.map((gig) => {
        return <GigInfo gig={gig} key={gig.id} />;
      })}
    </>
  );
};

export default Gigs;
