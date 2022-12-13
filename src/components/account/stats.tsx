import { Stack, Title, Text } from "@mantine/core";
import React from "react";
import { getOperatingYear } from "../../pages/stats/[paramYear]";
import { trpc } from "../../utils/trpc";
import Loading from "../loading";

const CorpsStats = () => {

  const currentOperatingYear = getOperatingYear();
  const { data: points, isLoading: pointsLoading } =
    trpc.corps.getPoints.useQuery();
  const { data: stats, isLoading: statsLoading } =
    trpc.stats.getYearly.useQuery({
      operatingYear: currentOperatingYear,
      selfOnly: true,
    });

  const corpsStats = stats?.corpsStats[stats.corpsIds[0] as string];
  
  const loading = pointsLoading || statsLoading;
  return (
    <Stack>
      <Title order={3}>Närvaro</Title>
      {loading && <Loading msg="Laddar..." />}
      {points !== undefined && (
        <Title order={5}>{`Du har totalt ${points} spelpoäng!`}</Title>
      )}
      {corpsStats && (
        <Stack spacing={0}>
          <Title order={6}>
            {`Nuvarande verksamhetsår (${currentOperatingYear}-${
              currentOperatingYear + 1
            }):`}
          </Title>
          <Text>
            {`Spelpoäng: ${corpsStats.gigsAttended}`}
            <br />
            {`Spelningar: ${Math.round(corpsStats.attendence * 100)}%`}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default CorpsStats;
