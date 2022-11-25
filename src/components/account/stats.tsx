import { Stack, Title, Text } from "@mantine/core";
import React from "react";
import { getOperatingYear } from "../../pages/stats/[paramYear]";
import { trpc } from "../../utils/trpc";
import Loading from "../loading";

const CorpsStats = () => {

  const currentOperatingYear = getOperatingYear();
  const { data: points, isLoading: pointsLoading } =
    trpc.stats.getPoints.useQuery({});
  const { data: stats, isLoading: statsLoading } =
    trpc.stats.getYearly.useQuery({
      operatingYear: currentOperatingYear,
      selfOnly: true,
    });

  const corpsStats = stats?.corpsStats[0];
  
  const loading = pointsLoading || statsLoading;
  return (
    <Stack>
      <Title order={2}>Närvaro</Title>
      {loading && <Loading msg="Laddar..." />}
      {points !== undefined && (
        <Text>{`Du har totalt ${points} spelpoäng!`}</Text>
      )}
      {corpsStats && (
        <Text>
          {`Närvaro för nuvarande verksamhetsår (${currentOperatingYear}-${
            currentOperatingYear + 1
          }):`}
          <br />
          {`Spelpoäng: ${corpsStats.gigsAttended}`}
          <br />
          {`Spelningar: ${Math.round(corpsStats.attendence * 100)}%`}
        </Text>
      )}
    </Stack>
  );
};

export default CorpsStats;
