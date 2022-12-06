import { Stack, Title, Grid } from "@mantine/core";
import React from "react";
import AccountPreferences from "../../components/account/preferences";
import CorpsStats from "../../components/account/stats";
import { trpc } from "../../utils/trpc";

const Account = () => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const corpsName =
    corps?.number !== null
      ? "#" + corps?.number.toString()
      : "p.e. " + corps?.lastName;

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <Title order={2}>{`Välkommen${corps ? ", " + corpsName : ""}!`}</Title>
      <Grid>
        <Grid.Col span={12} md={6}>
          <CorpsStats />
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <AccountPreferences />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Account;
