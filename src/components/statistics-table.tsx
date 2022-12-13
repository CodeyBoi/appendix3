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
  const { nbrOfGigs, positivelyCountedGigs, corpsStats, corpsIds } =
    stats ?? {};

  const { data: corpsPoints } = trpc.stats.getManyPoints.useQuery(
    { corpsIds },
    { enabled: !!corpsIds }
  );

  const nbrOfGigsString = `Detta verksamhetsår har vi haft ${nbrOfGigs} spelning${
    nbrOfGigs === 1 ? "" : "ar"
  }.`;
  const positiveGigsString =
    (positivelyCountedGigs ?? 0) > 0
      ? `Av dessa har ${positivelyCountedGigs} räknats positivt.`
      : "";

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
        </>
      )}
    </>
  );
};

export default StatisticsTable;
