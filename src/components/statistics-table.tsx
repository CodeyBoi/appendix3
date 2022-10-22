import { Table, Text } from "@mantine/core";
import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import AlertError from "./alert-error";

interface Stats {
  nbrOfGigs: number;
  positiveGigs: number;
  corpsii: Stat[];
}

interface Stat {
  id: number;
  number: number;
  firstName: string;
  lastName: string;
  gigPointsCollected: number;
  gigPointsMax: number;
}

interface StatisticsTableProps {
  operatingYear: number;
}

const StatisticsTable = ({ operatingYear }: StatisticsTableProps) => {

  const { data: stats, status: statsStatus } = useQuery<Stats>(['statistics', operatingYear], async () => {
    const start = new Date(operatingYear, 8, 1).toISOString().split('T')[0];
    const end = new Date(operatingYear + 1, 7, 31).toISOString().split('T')[0];
    const stats = await axios.get(`/api/stats?start=${start}&end=${end}`);
    return stats.data;
  }, { enabled: !!operatingYear });

  if (statsStatus === 'loading') {
    return <Loading msg="Laddar statistik..." />;
  } else if (statsStatus === 'error') {
    return <AlertError msg="Något gick fel under hämtningen av statistik." />;
  }


  const { corpsii: corpsiiStats, nbrOfGigs, positiveGigs } = stats;
  const nbrOfGigsString = `Detta verksamhetsår har vi haft ${nbrOfGigs} spelning${nbrOfGigs === 1 ? '' : 'ar'}.`;
  const positiveGigsString = (positiveGigs ?? 0) > 0 ? `Av dessa har ${positiveGigs} räknats positivt.` : "";
  return (
    <>
      {corpsiiStats?.length === 0 ? <Text>Det finns inga statistikuppgifter för detta år.</Text> :
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
              {corpsiiStats?.map(stat => (
                <tr key={stat.id}>
                  <td>{stat.number ?? 'p.e.'}</td>
                  <td>{`${stat.firstName} ${stat.lastName}`}</td>
                  <td>{stat.gigPointsCollected}</td>
                  <td>{`${Math.round(stat.gigPointsMax === 0 ? 1 : stat.gigPointsCollected / stat.gigPointsMax * 100)}%`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      }
    </>
  );
}

export default StatisticsTable;
