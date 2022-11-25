import { Box, Center, Group, Select, Title } from "@mantine/core";
import React from "react";
import StatisticsTable from "../../../components/statistics-table";
import Loading from "../../../components/loading";
import { useRouter } from "next/router";
import { NextPage } from "next";

export const getOperatingYear = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return month >= 8 ? year : year - 1;
}

const startOperatingYear = 2010;
const operatingYears = Array.from({ length: getOperatingYear() - startOperatingYear + 1 }, (_, i) => startOperatingYear + i).reverse();

const Statistics: NextPage = () => {

  const currentOperatingYear = getOperatingYear();

  const { query, isReady } = useRouter();
  const { paramYear } = query as { paramYear: string };

  const [year, setYear] = React.useState<number>(parseInt(paramYear) || currentOperatingYear);

  if (!isReady) {
    return <Loading msg="Laddar statistik..." />;
  }

  return (
    <Center>
      <Box>
        <Group>
          <Title>Statistik för verksamhetsår</Title>
          <Select
            size="lg"
            defaultValue={paramYear}
            maxDropdownHeight={500}
            data={operatingYears?.map(y => ({
              label: `${y}-${y + 1}`,
              value: y.toString()
            })) ?? []}
            onChange={(y) => {
              if (!y) {
                return;
              }
              const year = parseInt(y);
              if (year) {
                setYear(year);
              }
            }}
          />
        </Group>
        <StatisticsTable operatingYear={year} />
      </Box>
    </Center>
  );
}

export default Statistics;
