import React from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  PasswordInput,
  SimpleGrid,
  Title,
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
  const [submittning, setSubmitting] = React.useState(false);

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
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Ogiltig emailadress",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    if (creatingCorps) {

    }
  };

  return (
    <Box sx={{ maxWidth: 700, fontFamily: "Castellar" }} mx="auto">
      <Title order={2}>Skapa användare</Title>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
      >
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
            nothingFound="Inget hittades"
            data={INSTRUMENTS}
            {...form.getInputProps("mainInstrument")}
          />
          <TextInput
            withAsterisk
            label="Användarnamn"
            placeholder="Användarnamn"
            {...form.getInputProps("username")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="din@email.com"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            withAsterisk
            label="Lösenord"
            placeholder="Lösenord"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            withAsterisk
            label="Bekräfta lösenord"
            placeholder="Bekräfta lösenord"
            {...form.getInputProps("passwordConfirm")}
          />
        </SimpleGrid>
        <Group position="right" mt="md">
          <Button type="submit">Registrera</Button>
        </Group>
      </form>
    </Box>
  );
};

export default CreateCorps;
