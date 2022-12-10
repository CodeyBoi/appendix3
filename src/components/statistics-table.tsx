import { Table, Text } from "@mantine/core";
import React from "react";
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

  const { data: corpsPoints } = trpc.stats.getManyPoints.useQuery({
    corpsIds: stats?.corpsStats.map((c) => c.id),
  }, {
    enabled: !!stats,
  });

  const { nbrOfGigs, positivelyCountedGigs, corpsStats } = stats ?? {};

  const nbrOfGigsString = `Detta verksamhetsår har vi haft ${nbrOfGigs} spelning${
    nbrOfGigs === 1 ? "" : "ar"
  }.`;
  const positiveGigsString =
    (positivelyCountedGigs ?? 0) > 0
      ? `Av dessa har ${positivelyCountedGigs} räknats positivt.`
      : "";

  if (statsStatus === "loading") {
    return <Loading msg="Laddar statistik..." />;
  }

  if (statsStatus === "error") {
    return <AlertError msg="Kunde inte hämta spelningsstatistik." />;
  }

  return (
    <>
      {corpsStats?.length === 0 ? (
        <Text>Det finns inga statistikuppgifter för detta år.</Text>
      ) : (
        <>
          <Text>{nbrOfGigsString + " " + positiveGigsString}</Text>
          <Table>
            <thead>
              <tr>
                <th>Nummer</th>
                <th>Namn</th>
                <th style={{ textAlign: "center" }}>Spelpoäng</th>
                <th style={{ textAlign: "center" }}>Procent</th>
                <th style={{ textAlign: "center" }}>Totala spelpoäng</th>
              </tr>
            </thead>
            <tbody>
              {corpsPoints && corpsStats && corpsStats?.map((stat) => (
                <tr key={stat.id}>
                  <td>{stat.number ?? "p.e."}</td>
                  <td>{`${stat.firstName} ${stat.lastName}`}</td>
                  <td align="center">{stat.gigsAttended}</td>
                  <td align="center">{`${Math.round(stat.attendence * 100)}%`}</td>
                  <td align="center">{corpsPoints[stat.id]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default StatisticsTable;
