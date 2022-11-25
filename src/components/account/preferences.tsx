import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";

const initialValues = {
  firstName: "",
  lastName: "",
  vegetarian: false,
  vegan: false,
  glutenIntolerant: false,
  lactoseIntolerant: false,
  drinksAlcohol: false,
  otherFoodRestrictions: "",
  email: "",
};
type FormValues = typeof initialValues;

const AccountPreferences = () => {
  const { data: corps, isLoading: corpsLoading } = trpc.corps.getCorps.useQuery();
  const utils = trpc.useContext();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      firstName: (firstName) =>
        firstName.length > 0 ? null : "Förnamn måste anges",
      lastName: (lastName) =>
        lastName.length > 0 ? null : "Efternamn måste anges",
      email: (email) => (email.length > 0 ? null : "E-post måste anges"),
    },
  });

  useEffect(() => {
    if (!corps) {
      return;
    }
    form.setValues({
      firstName: corps.firstName,
      lastName: corps.lastName,
      vegetarian: corps.vegetarian,
      vegan: corps.vegan,
      glutenIntolerant: corps.glutenIntolerant,
      lactoseIntolerant: corps.lactoseIntolerant,
      drinksAlcohol: corps.drinksAlcohol,
      otherFoodRestrictions: corps.otherFoodRestrictions,
      email: corps.user.email || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corps]);

  const mutation = trpc.corps.update.useMutation({
    onSuccess: () => {
      utils.corps.getCorps.invalidate();
      setSubmitting(false);
    },
  });
  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    await mutation.mutateAsync(values);
  };

  return (
    <Stack>
      <Title order={2}>Inställningar</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={submitting || corpsLoading} />
          <Stack spacing="md">
            <Stack spacing="xs">
              <Title order={3}>Allmänt</Title>
              <TextInput
                label="Förnamn"
                placeholder="Förnamn"
                withAsterisk
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Efternamn"
                placeholder="Efternamn"
                withAsterisk
                {...form.getInputProps("lastName")}
              />
              <TextInput
                label="E-post"
                placeholder="E-post"
                withAsterisk
                {...form.getInputProps("email")}
              />
            </Stack>
            <Stack spacing="xs">
              <Title order={3}>Matpreferenser</Title>
              <Switch
                label="Dricker alkohol"
                {...form.getInputProps("drinksAlcohol", { type: "checkbox" })}
              />
              <Switch
                label="Vegetarian"
                {...form.getInputProps("vegetarian", { type: "checkbox" })}
              />
              <Switch label="Vegan" {...form.getInputProps("vegan")} />
              <Switch
                label="Glutenintolerant"
                {...form.getInputProps("glutenIntolerant", { type: "checkbox" })}
              />
              <Switch
                label="Laktosintolerant"
                {...form.getInputProps("lactoseIntolerant", { type: "checkbox" })}
              />
              <TextInput
                label="Övriga matpreferenser"
                placeholder="Övriga matpreferenser..."
                {...form.getInputProps("otherFoodRestrictions")}
              />
            </Stack>
            <Group position="right">
              <Button type="submit">Spara</Button>
            </Group>
          </Stack>
        </div>
      </form>
    </Stack>
  );
};

export default AccountPreferences;