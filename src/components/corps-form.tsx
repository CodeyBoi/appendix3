import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Select,
  SimpleGrid,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { trpc } from "../utils/trpc";
import FormLoadingOverlay from "./form-loading-overlay";

const initialValues = {
  firstName: "",
  lastName: "",
  number: "",
  bNumber: "",
  email: "",
  mainInstrument: "",
  otherInstruments: [] as string[],
  role: "user",
};
type FormValues = typeof initialValues;

const isNumber = (value: string) => {
  return /^\d*$/.test(value);
};

interface AdminCorpsProps {
  corpsId: string;
}

const CorpsForm = ({ corpsId }: AdminCorpsProps) => {
  const utils = trpc.useContext();
  const creatingCorps = corpsId === "new";
  const [loading, setLoading] = useState(!creatingCorps);
  const [submitting, setSubmitting] = useState(false);

  const { data: instruments } = trpc.instrument.getAll.useQuery();
  const { data: corps } = trpc.corps.get.useQuery({ id: corpsId });
  const { data: roles } = trpc.role.getAll.useQuery();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      firstName: (value) => (value.length > 0 ? null : "Fyll i förnamn"),
      lastName: (value) => (value.length > 0 ? null : "Fyll i efternamn"),
      number: (value) => (isNumber(value) ? null : "Ogitligt nummer"),
      bNumber: (value) => (isNumber(value) ? null : "Ogitligt balettnummer"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Ogiltig emailadress",
      mainInstrument: (value) => (value ? null : "Välj ett huvudinstrument"),
      otherInstruments: (value, values) =>
        value.includes(values.mainInstrument)
          ? "Huvudinstrument kan inte väljas som övrigt instrument"
          : null,
    },
  });

  useEffect(() => {
    if (corps) {
      const mainInstrument = corps.instruments.find((i) => i.isMainInstrument)
        ?.instrument.name;
      const otherInstruments = corps.instruments
        .filter((i) => !i.isMainInstrument)
        .map((i) => i.instrument.name);
      form.setValues({
        firstName: corps.firstName,
        lastName: corps.lastName,
        number: corps.number?.toString() || "",
        bNumber: corps.bNumber?.toString() || "",
        email: corps.user.email ?? "",
        mainInstrument,
        otherInstruments,
        role: corps.role?.name ?? "user",
      });
      setLoading(false);
    } else if (creatingCorps) {
      form.reset();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corps]);

  const mutation = trpc.corps.upsert.useMutation({
    onSuccess: () => {
      // router.push("/admin/corps");
      utils.corps.get.invalidate({ id: corpsId });
      utils.corps.getSelf.invalidate();
      setSubmitting(false);
      form.resetDirty();
      form.resetTouched();
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const number = values.number ? parseInt(values.number) : null;
    const bNumber = values.bNumber ? parseInt(values.bNumber) : null;
    mutation.mutateAsync({
      ...values,
      number,
      bNumber,
      id: creatingCorps ? undefined : corpsId,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormLoadingOverlay visible={loading || submitting}>
        <SimpleGrid
          cols={1}
          spacing="lg"
          breakpoints={[{ minWidth: "md", cols: 2 }]}
        >
          <TextInput
            withAsterisk
            label="Förnamn"
            placeholder="Förnamn"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            withAsterisk
            label="Efternamn"
            placeholder="Efternamn"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Nummer"
            placeholder="Nummer"
            description="Lämnas tomt om de inte har något"
            {...form.getInputProps("number")}
          />
          <TextInput
            label="Balettnummer"
            placeholder="Balettnummer"
            description="Lämnas tomt om de inte har något"
            {...form.getInputProps("bNumber")}
          />
          <Select
            label="Huvudinstrument"
            placeholder="Välj instrument..."
            nothingFound="Instrument kunde inte laddas"
            data={
              instruments?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            withAsterisk
            {...form.getInputProps("mainInstrument")}
          />
          <MultiSelect
            label="Övriga instrument"
            placeholder="Välj instrument..."
            clearable
            nothingFound="Instrument kunde inte laddas"
            data={
              instruments?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            {...form.getInputProps("otherInstruments")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="exempel@domän.se"
            {...form.getInputProps("email")}
          />
          <Select
            label="Behörighetsroll"
            placeholder="Välj behörighet..."
            data={roles?.map((i) => ({ value: i.name, label: i.name })) ?? []}
            withAsterisk
            {...form.getInputProps("role")}
          />
        </SimpleGrid>
      </FormLoadingOverlay>
      <Group position="right" mt="md">
        <Button
          disabled={
            !(
              form.isDirty() ||
              form.isTouched("otherInstruments") ||
              form.isTouched("role")
            )
          }
          type="submit"
          loading={loading || submitting}
        >
          {creatingCorps ? "Skapa corpsmedlem" : "Spara ändringar"}
        </Button>
      </Group>
    </form>
  );
};

export default CorpsForm;
