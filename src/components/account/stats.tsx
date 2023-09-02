import { Stack, Title, Text } from '@mantine/core';
import React from 'react';
import { getOperatingYear } from '../../pages/stats/[paramYear]';
import { trpc } from '../../utils/trpc';
import Loading from '../loading';

const CorpsStats = () => {
  const operatingYear = getOperatingYear();
  const start = new Date(operatingYear, 8, 1); // September 1st
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const operatingYearEnd = new Date(operatingYear + 1, 7, 31); // August 31st next year
  // If we're in the same year, we want to show the stats up to today
  const end = currentDate < operatingYearEnd ? currentDate : operatingYearEnd;
  const { data: points, isLoading: pointsLoading } =
    trpc.corps.getPoints.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.stats.get.useQuery({
    start,
    end,
    selfOnly: true,
  });
  const {
    data: orchestraRehearsalAttendance,
    isLoading: orchestraAttendanceLoading,
  } = trpc.rehearsal.getOwnOrchestraAttendance.useQuery({
    start,
    end,
  });
  const {
    data: balletRehearsalAttendance,
    isLoading: balletAttendanceLoading,
  } = trpc.rehearsal.getOwnBalletAttendance.useQuery({
    start,
    end,
  });
  const corpsStats = stats?.corpsStats[stats.corpsIds[0] as string];

  const loading =
    pointsLoading ||
    statsLoading ||
    orchestraAttendanceLoading ||
    balletAttendanceLoading;
  return (
    <Stack>
      <Title order={3}>Närvaro</Title>
      {loading && <Loading msg='Laddar...' />}
      {points !== undefined && (
        <Title order={5}>{`Du har totalt ${points} spelpoäng!`}</Title>
      )}
      {corpsStats &&
        orchestraRehearsalAttendance !== undefined &&
        balletRehearsalAttendance !== undefined && (
          <Stack spacing={0}>
            <Title order={6}>
              {`Nuvarande verksamhetsår (${operatingYear}-${
                operatingYear + 1
              }):`}
            </Title>
            <Text>
              {`Spelpoäng: ${corpsStats.gigsAttended}`}
              <br />
              {`Spelningar: ${Math.ceil(corpsStats.attendence * 100)}%`}
              {orchestraRehearsalAttendance !== 0 && (
                <>
                  <br />
                  {`Orkesterrepor: ${Math.ceil(
                    orchestraRehearsalAttendance * 100,
                  )}%`}
                </>
              )}
              {balletRehearsalAttendance !== 0 && (
                <>
                  <br />
                  {`Balettrepor: ${Math.ceil(
                    balletRehearsalAttendance * 100,
                  )}%`}
                </>
              )}
            </Text>
          </Stack>
        )}
    </Stack>
  );
};

export default CorpsStats;
