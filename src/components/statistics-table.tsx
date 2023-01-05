import { Stack, Table, Text } from "@mantine/core";
import React from "react";
import { getOperatingYear } from "../pages/stats/[paramYear]";
import { trpc } from "../utils/trpc";
import AlertError from "./alert-error";
import Loading from "./loading";

interface StatisticsTableProps {
  operatingYear: number;
}

const StatisticsTable = ({ operatingYear }: StatisticsTableProps) => {
  const { data: stats, status: statsStatus } = trpc.stats.getYearly.useQuery({
    operatingYear,
  });
  const { nbrOfGigs, positivelyCountedGigs, corpsStats, corpsIds } =
    stats ?? {};

  const { data: corps } = trpc.corps.getSelf.useQuery();

  const { data: corpsPoints } = trpc.stats.getManyPoints.useQuery(
    { corpsIds },
    { enabled: !!corpsIds }
  );

  const isCurrentYear = operatingYear === getOperatingYear();

  const nbrOfGigsString = `Detta verksamhetsår ${isCurrentYear ? 'har vi hittills haft' : 'hade vi'} ${nbrOfGigs} spelning${
    nbrOfGigs === 1 ? "" : "ar"
  }`;
  const positiveGigsString =
    (positivelyCountedGigs ?? 0) > 0
      ? `, där ${positivelyCountedGigs} ${isCurrentYear ? 'räknats' : 'räknades'} positivt.`
      : ".";

  const ownPoints =
    corps && stats ? stats.corpsStats[corps.id]?.gigsAttended : undefined;
  const ownAttendence =
    corps && stats ? stats.corpsStats[corps.id]?.attendence : undefined;
  const ownPointsString =
    ownPoints && ownAttendence
      ? `Du ${isCurrentYear ? 'har varit' : 'var'} med på ${ownPoints} spelning${
          ownPoints === 1 ? "" : "ar"
        }, vilket ${isCurrentYear ? 'motsvarar' : 'motsvarade'} ${Math.round(
          ownAttendence * 100
        )}%.`
      : undefined;

  if (!corpsStats || !corpsPoints) {
    return <Loading msg="Laddar statistik..." />;
  }

  if (statsStatus === "error") {
    return <AlertError msg="Kunde inte hämta spelningsstatistik." />;
  }

  return (
    <>
      {corpsIds && corpsIds.length === 0 && (
        <Text>Det finns inga statistikuppgifter för detta år.</Text>
      )}
      {corpsPoints && corpsStats && corpsIds && (
        <Stack>
          <Text>{nbrOfGigsString + positiveGigsString}</Text>
          {ownPointsString && <Text>{ownPointsString}</Text>}
          <Table>
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Namn</th>
                <th style={{ textAlign: "center" }}>Spelpoäng</th>
                <th style={{ textAlign: "center" }}>Närvaro</th>
                <th style={{ textAlign: "center" }}>Totala spelpoäng</th>
              </tr>
            </thead>
            <tbody>
              {corpsIds.map((id) => {
                const stat = corpsStats[id];
                if (!stat) return null;
                return (
                  <tr key={id}>
                    <td>{stat.number ?? "p.e."}</td>
                    <td>{`${stat.firstName} ${stat.lastName}`}</td>
                    <td align="center">{stat.gigsAttended}</td>
                    <td align="center">{`${Math.round(
                      stat.attendence * 100
                    )}%`}</td>
                    <td align="center">{corpsPoints.points[id]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Stack>
      )}
    </>
  );
};

export default StatisticsTable;
