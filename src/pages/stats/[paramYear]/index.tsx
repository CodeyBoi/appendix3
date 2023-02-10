import { Button, Group, Select, Stack, Title } from "@mantine/core";
import React from "react";
import StatisticsTable from "../../../components/statistics-table";
import Loading from "../../../components/loading";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { NextLink } from "@mantine/next";
import { IconMoodNerd } from "@tabler/icons";

export const getOperatingYear = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return month >= 8 ? year : year - 1;
};

const startOperatingYear = 2010;
const operatingYears = Array.from(
  { length: getOperatingYear() - startOperatingYear + 1 },
  (_, i) => startOperatingYear + i
).reverse();

const Statistics: NextPage = () => {
  const currentOperatingYear = getOperatingYear();

  const router = useRouter();
  const { paramYear } = router.query as { paramYear: string };

  const [year, setYear] = React.useState<number>(
    parseInt(paramYear) || currentOperatingYear
  );

  if (!router.isReady) {
    return <Loading msg="Laddar statistik..." />;
  }

  return (
    <Stack sx={{ maxWidth: 700 }}>
      <Title order={2}>Statistik</Title>
      <Group position="left">
        <Select
          label="Verksamhetsår"
          defaultValue={paramYear}
          maxDropdownHeight={500}
          data={
            operatingYears?.map((y) => ({
              label: `${y}-${y + 1}`,
              value: y.toString(),
            })) ?? []
          }
          onChange={(y) => {
            if (!y) {
              return;
            }
            const year = parseInt(y);
            if (year) {
              setYear(year);
            }
            router.push(`/stats/${y}`);
          }}
        />
      </Group>
      <StatisticsTable operatingYear={year} />
      <Button
        
        component={NextLink}
        href="/stats/for/nerds"
        leftIcon={<IconMoodNerd />}
      >
        Statistik för nördar
      </Button>
    </Stack>
  );
};

export default Statistics;
