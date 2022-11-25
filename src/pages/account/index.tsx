import { Stack, Title, Center, Grid } from "@mantine/core";
import React from "react";
import AccountPreferences from "../../components/account/preferences";
import CorpsStats from "../../components/account/stats";
import { trpc } from "../../utils/trpc";

const Account = () => {
  const { data: corps } = trpc.corps.getCorps.useQuery();
  const corpsName =
    corps?.number !== null
      ? "#" + corps?.number.toString()
      : "p.e. " + corps?.lastName;

  return (
    <Center>
      <Stack sx={{ width: "70%" }}>
        <Title>{`Välkommen, ${corpsName}!`}</Title>
        <Grid>
          <Grid.Col sm={12} md={6}>
            <CorpsStats />
          </Grid.Col>
          <Grid.Col sm={12} md={6}>
            <AccountPreferences />
          </Grid.Col>
        </Grid>
      </Stack>
    </Center>
  );
};

export default Account;
