import { Center, Group, Stack, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import SelectCorps from "../../../components/select-corps";

const ViewCorps = () => {
  const router = useRouter();
  return (
    <Center>
      <Stack>
        <Group>
          <Title order={2}>Uppdatera corpsmedlem:</Title>
          <SelectCorps
            placeholder="Välj corps..."
            onChange={(id) => router.push(`/admin/corps/${id}`)}
          />
        </Group>
      </Stack>
    </Center>
  );
};

export default ViewCorps;
