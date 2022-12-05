import React from "react";
import { Group, Stack, Title } from "@mantine/core";
import { useRouter } from "next/router";
import CorpsForm from "../../../../components/corps-form";
import SelectCorps from "../../../../components/select-corps";

const AdminCorps = () => {
  const router = useRouter();
  const corpsId = router.query.id as string;
  const creatingCorps = corpsId === "new";
  const title = creatingCorps ? "Skapa corpsmedlem" : "Uppdatera corpsmedlem:";
  return (
    <>
      {corpsId && (
        <Stack sx={{ maxWidth: 700 }}>
          <Group>
            <Title order={2}>{title}</Title>
            {!creatingCorps && (
              <SelectCorps
                placeholder="Välj corps..."
                onChange={(id) => router.push(`/admin/corps/${id}`)}
                defaultValue={corpsId}
              />
            )}
          </Group>
          <CorpsForm corpsId={corpsId} />
        </Stack>
      )}
    </>
  );
};

export default AdminCorps;
