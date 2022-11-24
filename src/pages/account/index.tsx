import { Stack, Title, Text } from "@mantine/core";
import React from "react";
import { trpc } from "../../utils/trpc";

const Account = () => {

  const { data: points, isLoading: pointsAreLoading } = trpc.stats.getPoints.useQuery({});

  if (pointsAreLoading) {
    return <Text>Laddar...</Text>;
  }

  console.log({ points });

  return (
    <Stack>
      <Title>Mina sidor</Title>
      <Text>{`Du har ${points} spelpoäng!`}</Text>
    </Stack>
  );
}
 
export default Account;