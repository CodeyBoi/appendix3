import { Title, Text } from '@mantine/core';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';

const Gigs: NextPage = () => {

  const session = useSession();
  console.log(session);

  return (
    <>
      <Title>Spelningar</Title>
      <Text>INTE IMPLEMENTERAT</Text>
    </>
  );
}

export default Gigs;
