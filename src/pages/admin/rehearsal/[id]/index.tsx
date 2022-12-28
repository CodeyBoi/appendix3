import { Stack, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import Loading from "../../../../components/loading";
import { trpc } from "../../../../utils/trpc";
import RehearsalForm from "../../../../components/rehearsal-form";

const AdminRehearsal = () => {
  const router = useRouter();
  const rehearsalId = router.query.id as string;
  const newRehearsal = rehearsalId === "new";
  
  const { data: rehearsal } = trpc.rehearsal.getWithId.useQuery(rehearsalId,
    { enabled: !newRehearsal && !!rehearsalId });

  return (
    <Stack align="flex-start" sx={{ maxWidth: "350px" }}>
      <Title order={2}>{(newRehearsal ? 'Skapa' : 'Uppdatera') + ' repa'}</Title>
      {!newRehearsal && !rehearsal && <Loading msg="Laddar repa..." />}
      {!newRehearsal && rehearsal && (
        <RehearsalForm rehearsal={rehearsal} />
      )}
      {newRehearsal && (
        <RehearsalForm />
      )}
    </Stack>
  );
};

export default AdminRehearsal;
