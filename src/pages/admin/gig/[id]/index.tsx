import React, { useEffect } from "react";
import {
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconClock } from "@tabler/icons";
import MultiSelectCorpsii from "../../../../components/multi-select-corpsii";
import { useRouter } from "next/router.js";
import { trpc } from "../../../../utils/trpc";
import "dayjs/locale/sv";
import FormLoadingOverlay from "../../../../components/form-loading-overlay";

const initialValues = {
  title: "",
  type: "",
  description: "",
  location: "",
  date: null as unknown as Date,
  meetup: "",
  start: "",
  signupStart: null as unknown as Date | null,
  signupEnd: null as unknown as Date | null,
  isPublic: false,
  points: 1,
  countsPositively: false,
  checkbox1: "",
  checkbox2: "",
  hiddenFor: [] as string[],
};

type FormValues = typeof initialValues;

const AdminGig = () => {
  const router = useRouter();
  const gigId = router.query.id as string;
  const newGig = gigId === "new";
  const utils = trpc.useContext();

  const [loading, setLoading] = React.useState(!newGig);
  const [submitting, setSubmitting] = React.useState(false);

  const { data: gig } = trpc.gig.getWithId.useQuery(
    { gigId },
    { enabled: !newGig && !!gigId }
  );

  const { data: gigTypes } = trpc.gigType.getAll.useQuery();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      title: (title) => (title ? null : "Titel måste vara ifylld"),
      type: (type) => (type ? null : "Typ måste vara ifylld"),
      date: (date) => (date ? null : "Datum måste vara ifyllt"),
      points: (points) =>
        points >= 0 ? null : "Spelpoäng kan inte vara negativt",
    },
  });

  useEffect(() => {
    if (gig) {
      form.setValues({
        title: gig.title,
        type: gig.type.name,
        description: gig.description,
        location: gig.location,
        date: gig.date,
        meetup: gig.meetup,
        start: gig.start,
        signupStart: gig.signupStart ?? null,
        signupEnd: gig.signupEnd ?? null,
        isPublic: gig.isPublic,
        points: gig.points,
        countsPositively: gig.countsPositively,
        checkbox1: gig.checkbox1,
        checkbox2: gig.checkbox2,
        hiddenFor: gig.hiddenFor.map((c) => c.corpsId),
      });
      setLoading(false);
      form.resetDirty();
    } else if (newGig) {
      // Needed if user is editing an existing gig and then clicks "New gig"
      form.reset();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gig, newGig]);

  const mutation = trpc.gig.upsert.useMutation({
    onSuccess: () => {
      utils.gig.getWithId.invalidate({ gigId });
      utils.gig.getMany.invalidate();
      setSubmitting(false);
      router.push("/");
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    console.log(values.date);
    values.date.setMinutes(values.date.getMinutes() - values.date.getTimezoneOffset());
    console.log(values.date);
    const data = {
      ...values,
      hiddenFor: values.isPublic ? [] : values.hiddenFor,
    };
    if (newGig) {
      mutation.mutateAsync(data);
    } else {
      mutation.mutateAsync({ ...data, gigId });
    }
  };

  return (
      <Stack align={"flex-start"}>
        {newGig ? (
          <Title order={2}>Skapa spelning</Title>
        ) : (
          <Title order={2}>Uppdatera spelning</Title>
        )}
        <form
          style={{ maxWidth: "720px" }}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <FormLoadingOverlay visible={loading || submitting}>
            <SimpleGrid cols={1 } breakpoints={[{ minWidth: "md", cols: 2 } ]} mb="md">
              <TextInput
                label="Titel"
                placeholder="Titel"
                withAsterisk
                spellCheck={false}
                {...form.getInputProps("title")}
              />
              <Select
                withAsterisk
                label="Spelningstyp"
                placeholder="Välj typ..."
                data={
                  gigTypes?.map((type) => ({
                    value: type.name,
                    label: type.name,
                  })) ?? []
                }
                {...form.getInputProps("type")}
              />
              <NumberInput
                withAsterisk
                label="Spelpoäng"
                {...form.getInputProps("points")}
              />
              <DatePicker
                withAsterisk
                label="Spelningsdatum"
                placeholder="Välj datum..."
                icon={<IconCalendar />}
                clearable={false}
                {...form.getInputProps("date")}
              />
            </SimpleGrid>
            <Grid mb="xs">
              <Grid.Col span={12} md={6}>
                <TextInput
                  label="Plats"
                  placeholder="Plats"
                  spellCheck={false}
                  {...form.getInputProps("location")}
                />
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <TextInput
                  icon={<IconClock />}
                  label="Samlingstid"
                  placeholder="Samlingstid"
                  spellCheck="false"
                  {...form.getInputProps("meetup")}
                />
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <TextInput
                  icon={<IconClock />}
                  label="Spelningstart"
                  placeholder="Spelningstart"
                  spellCheck="false"
                  {...form.getInputProps("start")}
                />
              </Grid.Col>
            </Grid>
            <Textarea
              mb="md"
              autosize
              label="Beskrivning"
              placeholder="Beskrivning"
              {...form.getInputProps("description")}
            />
            <SimpleGrid cols={1} mb="md" breakpoints={[{ minWidth: "md", cols: 2 }]}>
              <DatePicker
                label="Anmälningsstart"
                description="Lämna tom för att tillåta anmälan omedelbart"
                placeholder="Välj datum..."
                icon={<IconCalendar />}
                clearable={true}
                {...form.getInputProps("signupStart")}
              />
              <DatePicker
                label="Anmälningsstopp"
                description="Lämna tom för att tillåta anmälan tills spelningen börjar"
                placeholder="Välj datum..."
                icon={<IconCalendar />}
                clearable={true}
                {...form.getInputProps("signupEnd")}
              />
              <TextInput
                label="Kryssruta 1"
                placeholder="Kryssruta 1"
                description="Lämna tom för att inte visa kryssruta"
                {...form.getInputProps("checkbox1")}
              />
              <TextInput
                label="Kryssruta 2"
                placeholder="Kryssruta 2"
                description="Lämna tom för att inte visa kryssruta"
                {...form.getInputProps("checkbox2")}
              />
            </SimpleGrid>
            <MultiSelectCorpsii
              mb="md"
              maxDropdownHeight={260}
              label="Dölj spelning"
              disabled={form.values.isPublic}
              defaultValue={form.values.hiddenFor}
              description="Spelningsanmälan kommer inte att synas för dessa corps"
              placeholder="Välj corps..."
              {...form.getInputProps("hiddenFor")}
            />
            <Group position="apart">
              <Group position="left">
                <Switch
                  label="Allmän spelning?"
                  radius="xl"
                  {...form.getInputProps("isPublic", { type: "checkbox" })}
                />
                <Switch
                  label="Räknas positivt?"
                  radius="xl"
                  {...form.getInputProps("countsPositively", {
                    type: "checkbox",
                  })}
                />
              </Group>
              <Group position="right">
                {!newGig && (
                  <Button
                    variant="outline"
                    compact
                    uppercase
                    onClick={() => {
                      if (
                        window.confirm(
                          "Detta kommer att radera spelningen och går inte att ångra. Är du säker?"
                        )
                      ) {
                        // TODO: Delete gig
                        router.push("/");
                      }
                    }}
                  >
                    Radera spelning
                  </Button>
                )}
                <Button type="submit" disabled={!form.isDirty()}>
                  {newGig ? "Skapa spelning" : "Spara ändringar"}
                </Button>
              </Group>
            </Group>
          </FormLoadingOverlay>
        </form>
      </Stack>
  );
};

export default AdminGig;
