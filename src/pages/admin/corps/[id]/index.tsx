import React, { useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  SimpleGrid,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";

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

const CreateCorps = () => {
  const router = useRouter();
  const corpsId = router.query.id as string;
  const creatingCorps = corpsId === "new";
  const utils = trpc.useContext();

  const [loading, setLoading] = React.useState(!creatingCorps);
  const [submitting, setSubmitting] = React.useState(false);

  const { data: instruments } = trpc.instrument.getAll.useQuery();
  const { data: corps } = trpc.corps.getSelf.useQuery(undefined, {
    enabled: !creatingCorps,
  });

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      firstName: (value) =>
        value.length > 0 ? null : "Förnamn måste vara ifyllt",
      lastName: (value) =>
        value.length > 0 ? null : "Efternamn måste vara ifyllt",
      number: (value) =>
        /^[0-9]+/.test(value)
          ? null
          : "Nummer får bara innehålla siffror (duh)",
      bNumber: (value) =>
        /^[0-9]+/.test(value)
          ? null
          : "Balettnummer får bara innehålla siffror (duh)",
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Ogiltig emailadress",
    },
  });

  useEffect(() => {
    if (!corps) {
      return;
    }
    const mainInstrument = corps.instruments.find((i) => i.isMainInstrument)?.instrument.name;
    const otherInstruments = corps.instruments.filter((i) => !i.isMainInstrument).map((i) => i.instrument.name);
    form.setValues({
      firstName: corps.firstName,
      lastName: corps.lastName,
      number: corps.number?.toString() || "",
      bNumber: corps.bNumber?.toString() || "",
      email: corps.user.email ?? "",
      mainInstrument,
      otherInstruments,
    });
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corps]);

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    if (creatingCorps) {

    }
  };

  return (
    <Box sx={{ maxWidth: 700, fontFamily: "Castellar" }} mx="auto">
      <Title order={2}>Skapa användare</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div>
          <LoadingOverlay visible={loading || submitting} />
          <SimpleGrid
            cols={2}
            spacing="lg"
            breakpoints={[{ maxWidth: 600, cols: 1 }]}
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
              placeholder="Nummer (lämnas tomt om du inte har något)"
              {...form.getInputProps("number")}
            />
            <Select
              withAsterisk
              label="Huvudinstrument"
              placeholder="Välj instrument..."
              searchable
              nothingFound="Inget instrument hittades"
              data={instruments}
              {...form.getInputProps("mainInstrument")}
            />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="din@email.com"
              {...form.getInputProps("email")}
            />
          </SimpleGrid>
          <Group position="right" mt="md">
            <Button type="submit">Registrera</Button>
          </Group>
        </div>
      </form>
    </Box>
  );
};

export default CreateCorps;
