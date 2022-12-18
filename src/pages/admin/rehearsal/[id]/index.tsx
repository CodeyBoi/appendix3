import { Button, Group, Select, Stack, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar } from "@tabler/icons";
import { useRouter } from "next/router";
import React from "react";
import MultiSelectCorps from "../../../../components/multi-select-corps";
import { trpc } from "../../../../utils/trpc";

const defaultValues = {
  title: "",
  date: null as unknown as Date,
  type: "",
  corpsIds: [] as string[],
};
type FormValues = typeof defaultValues;

const AdminRehearsal = () => {
  const router = useRouter();
  const rehearsalId = router.query.id as string;
  const newRehearsal = rehearsalId === "new";
  const utils = trpc.useContext();
  
  const { data: rehearsal } = trpc.rehearsal.getWithId.useQuery(rehearsalId,
    { enabled: !newRehearsal && !!rehearsalId });

  const { data: rehearsalTypes } = trpc.rehearsal.getTypes.useQuery();

  const form = useForm<FormValues>({
    initialValues: rehearsal && !newRehearsal ? {
      title: rehearsal.title,
      date: rehearsal.date,
      type: rehearsal.type,
      corpsIds: rehearsal.corpsIds,
    } : defaultValues,
    validate: {
      title: (title) => (title ? null : "Fyll i titel"),
      date: (date) => (date ? null : "Välj datum"),
      type: (type) => (type ? null : "Välj typ"),
    },
  });

  const create = trpc.rehearsal.upsert.useMutation({
    onSuccess: () => {
      utils.rehearsal.getWithId.invalidate(rehearsalId);
      router.push("/admin/rehearsal");
    },
  });

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    values.date.setMinutes(values.date.getMinutes() - values.date.getTimezoneOffset());
    if (newRehearsal) {
      await create.mutateAsync(values);
    } else {
      await create.mutateAsync({ ...values, id: rehearsalId });
    }
  };

  return (
    <Stack align="flex-start" sx={{ maxWidth: "350px" }}>
      <Title order={2}>{(newRehearsal ? 'Skapa' : 'Uppdatera') + ' repa'}</Title>
      <form style={{ width: "100%" }} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Titel"
            placeholder="Titel"
            withAsterisk
            spellCheck={false}
            {...form.getInputProps("title")}
          />
          <DatePicker
            label="Datum"
            withAsterisk
            placeholder="Välj datum"
            icon={<IconCalendar />}
            clearable={false}
            {...form.getInputProps("date")}
          />
          <Select
            withAsterisk
            label="Typ av repa"
            placeholder="Välj typ..."
            data={rehearsalTypes?.map((type) => ({
              label: type,
              value: type,
            })) ?? []}
            {...form.getInputProps("type")}
          />
          <MultiSelectCorps
            label="Närvarande corps"
            placeholder="Välj corps..."
            {...form.getInputProps("corpsIds")}
          />
          <Group position="right">
            <Button type="submit" disabled={!form.isValid}>
              {(newRehearsal ? 'Skapa' : 'Uppdatera') + ' repa'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default AdminRehearsal;
