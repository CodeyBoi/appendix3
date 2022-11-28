import { Center, Group, Stack, Title } from "@mantine/core";
import React from "react";
import SelectCorpsii from "../../../components/select-corps";
import { trpc } from "../../../utils/trpc";

const ViewCorps = () => {

  const [corpsId, setCorpsId] = React.useState<string | null>(null);
  const { data: corps } = trpc.corps.get.useQuery({ id: corpsId || "" }, { enabled: corpsId !== null });

  return (
    <Center>
      <Stack>
        <Group>
          <Title order={2}>Hantera corpsmedlem:</Title>
          <SelectCorpsii
            placeholder="Välj corps..."
            onChange={setCorpsId}
          />
        </Group>
        {/* TODO: insert corps info here and make it editable by the admin */}
      </Stack>
    </Center>
  );
};

export default ViewCorps;
