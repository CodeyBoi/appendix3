import React from 'react';
import { Title, Text } from '@mantine/core';
import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import GigInfo from '../../components/gig/info';

const Gigs: NextPage = () => {

  const blabal = {
    id: 1,
    namn: "hugo",
    roll: "kingen",
    corps: {
      id: 1,
      instrument: "trombon",
    },
  };

  const { data: corps, status: corpsStatus } = trpc.corps.getCorps.useQuery();
  const { data: gigs, status: gigsStatus } = trpc.gig.getMany.useQuery({ corpsId: corps?.id ?? -1 }, { enabled: !!corps });

  return (
    <>
      {gigs?.map((gig) => {
        return (
          <GigInfo gig={gig} key={gig.id} />
        );
      })}
    </>
  );
}

export default Gigs;
