import {
  Card,
  Group,
  Select,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import React, { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { getOperatingYear } from "../../stats/[paramYear]";

const Rehearsals = () => {
  const [year, setYear] = useState(getOperatingYear());
  const start = new Date(year, 8, 1);
  const end = new Date(year + 1, 7, 31);
  const startYear = 2010;
  const endYear = new Date().getFullYear();

  const years = [];
  for (let i = endYear; i >= startYear; i--) {
    years.push({
      value: i.toString(),
      label: i.toString() + "-" + (i + 1).toString(),
    });
  }

  const { data: rehearsals } = trpc.rehearsal.getMany.useQuery({
    start,
    end,
  });

  return (
    <Stack align="flex-start">
      <Title order={2}>Repor</Title>
      <Select
        label="Verksamhetsår"
        value={year.toString()}
        onChange={(value) => setYear(parseInt(value as string))}
        data={years}
      />
      <Stack spacing="xs">
        {rehearsals?.map((rehearsal) => (
          <Card
            key={rehearsal.id}
            shadow="sm"
            component={NextLink}
            href={`/admin/rehearsal/${rehearsal.id}`}
          >
            <Group position="left">
              <Text>{dayjs(rehearsal.date).format("YYYY-MM-DD")}</Text>
              <Text>{rehearsal.title}</Text>
            </Group>
          </Card>
        ))}
      </Stack>
      {rehearsals && rehearsals.length === 0 && (
        <Text>Inga rep finns registrerade detta år</Text>
      )}
    </Stack>
  );
};

export default Rehearsals;
