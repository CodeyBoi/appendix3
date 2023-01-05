import { Table } from "@mantine/core";
import { Corps } from "@prisma/client";
import React from "react";

type RehearsalStatsProps = {
  totalRehearsals: number;
  stats: {
    corps: Corps,
    count: number,
  }[];
};

const formatName = (corps: Corps) => {
  const prefix = corps.number ? '#' + corps.number.toString() : 'p.e.';
  return `${prefix} ${corps.firstName} ${corps.lastName}`;
};

const RehearsalStats = ({ totalRehearsals, stats }: RehearsalStatsProps) => {
  return (
    <Table>
      <tbody>
        {stats.map((stat) => (
          <tr key={stat.corps.id}>
            <td>{formatName(stat.corps)}</td>
            <td>{stat.count}</td>
            <td>{Math.round((stat.count / totalRehearsals) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RehearsalStats;
