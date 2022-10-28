import { Skeleton, Table, Text } from "@mantine/core";
import React from "react";
import { trpc } from "../utils/trpc";
import AlertError from "./alert-error";

interface StatisticsTableProps {
  operatingYear: number;
}

const StatisticsTable = ({ operatingYear }: StatisticsTableProps) => {

  const { data: stats, status: statsStatus } =
    trpc.stats.yearly.useQuery({ operatingYear });

  const { nbrOfGigs, positivelyCountedGigs, corpsStats } = stats ?? {};

  const nbrOfGigsString =
    `Detta verksamhetsår har vi haft ${nbrOfGigs} spelning${nbrOfGigs === 1 ? '' : 'ar'}.`;
  const positiveGigsString = 
    (positivelyCountedGigs ?? 0) > 0 ? `Av dessa har ${positivelyCountedGigs} räknats positivt.` : "";

  if (statsStatus === 'error') {
    return <AlertError msg="Kunde inte hämta spelningsstatistik." />;
  }

  return (
    <Skeleton visible={!corpsStats}>
      <>
        {corpsStats?.length === 0 ? <Text>Det finns inga statistikuppgifter för detta år.</Text> :
          <>
            <Text>{nbrOfGigsString + ' ' + positiveGigsString}</Text>
            <Table>
              <thead>
                <tr>
                  <th>Nummer</th>
                  <th>Namn</th>
                  <th>Spelpoäng</th>
                  <th>Procent</th>
                </tr>
              </thead>
              <tbody>
                {corpsStats?.map(stat => (
                  <tr key={stat.id}>
                    <td>{stat.number ?? 'p.e.'}</td>
                    <td>{`${stat.firstName} ${stat.lastName}`}</td>
                    <td>{stat.gigsAttended}</td>
                    <td>{`${Math.round(stat.attendence * 100)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        }
      </>
    </Skeleton>
  );
}

export default StatisticsTable;
