import React, { useEffect } from "react";
import { Button, Checkbox, Grid, Group, NumberInput, Select, SimpleGrid, Stack, Textarea, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconClock } from "@tabler/icons";
import MultiSelectCorpsii from "../../../../components/multi-select-corpsii";
import { useRouter } from "next/router.js";
import { trpc } from "../../../../utils/trpc";
import 'dayjs/locale/sv';

interface FormValues {
  title: string;
  type: string;
  description: string;
  location: string;
  date: Date;
  meetup: string;
  start: string;
  signupStart: Date;
  signupEnd: Date;
  isPublic: boolean;
  points: number;
  countsPositively: boolean;
  checkbox1: string;
  checkbox2: string;
  hiddenFor: string[];
}

const initialValues: FormValues = {
  title: "",
  type: "",
  description: "",
  location: "",
  date: "" as unknown as Date,
  meetup: "",
  start: "",
  signupStart: "" as unknown as Date,
  signupEnd: "" as unknown as Date,
  isPublic: false,
  points: 1,
  countsPositively: false,
  checkbox1: '',
  checkbox2: '',
  hiddenFor: [],
};

const AdminGig = ({ newGig }: { newGig: boolean }) => {

  const router = useRouter();
  const gigId = parseInt(router.query.gigId as string ?? "0");
  const utils = trpc.useContext();

  const [submittning, setSubmittning] = React.useState(false);

  const { data: gig, status: gigStatus } =
    trpc.gig.getWithId.useQuery({ gigId }, { enabled: !newGig && !!gigId });

  const { data: gigTypes } = trpc.gigType.getAll.useQuery();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      title: title => title ? null : 'Titel måste vara ifylld',
      type: type => type ? null : 'Typ måste vara ifylld',
      date: date => date ? null : 'Datum måste vara ifylld',
      points: points => points >= 0 ? null : 'Spelpoäng kan inte vara negativt',
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
        signupStart: gig.signupStart ?? '' as unknown as Date,
        signupEnd: gig.signupEnd ?? '' as unknown as Date,
        isPublic: gig.isPublic,
        points: gig.points,
        countsPositively: gig.countsPositively,
        checkbox1: gig.checkbox1,
        checkbox2: gig.checkbox2,
        hiddenFor: gig.hiddenFor.map(c => c.corpsId.toString()),
      });
    }
  }, [gig]);

  const mutation = trpc.gig[newGig ? 'create' : 'update'].useMutation({
    onSuccess: () => {
      utils.gig.getWithId.invalidate({ gigId });
      utils.gig.getMany.invalidate();
      router.push('/');
    },
  })

  const handleSubmit = async (values: any) => {
    setSubmittning(true);
    if (newGig) {
      mutation.mutateAsync(values);
    } else {
      mutation.mutateAsync({ ...values, id: gigId });
    }
  }

  return (
    <Group position="center">
      <Stack align={"flex-start"}>
        {newGig ? <Title order={2}>Skapa spelning</Title> : <Title order={2}>Uppdatera spelning</Title>}
        {gigStatus !== 'loading' &&
          <form style={{ maxWidth: "720px" }} onSubmit={form.onSubmit(handleSubmit)}>
            <SimpleGrid cols={2} mb="md" >
              <TextInput
                label="Titel"
                placeholder="Titel"
                withAsterisk
                spellCheck={false}
                {...form.getInputProps('title')}
              />
              <Select
                withAsterisk
                label="Spelningstyp"
                placeholder="Välj typ..."
                data={gigTypes?.map((type) => ({ value: type.name, label: type.name })) ?? []}
                {...form.getInputProps('typeId')}
              />
              <DatePicker
                withAsterisk
                label="Spelningsdatum"
                placeholder="Välj datum..."
                icon={<IconCalendar />}
                clearable={false}
                {...form.getInputProps('date')}
              />
              <NumberInput
                withAsterisk
                label="Spelpoäng"
                {...form.getInputProps('points')}
              />
            </SimpleGrid>
            <Grid mb="xs">
              <Grid.Col span={6}>
                <TextInput
                  label="Plats"
                  placeholder="Plats"
                  spellCheck={false}
                  {...form.getInputProps('location')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  icon={<IconClock />}
                  label="Samlingstid"
                  placeholder="Samlingstid"
                  spellCheck="false"
                  {...form.getInputProps('meetup')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  icon={<IconClock />}
                  label="Spelningstart"
                  placeholder="Spelningstart"
                  spellCheck="false"
                  {...form.getInputProps('start')}
                />
              </Grid.Col>
            </Grid>
            <Textarea
              mb="md"
              autosize
              label="Beskrivning"
              placeholder="Beskrivning"
              {...form.getInputProps('description')}
            />
            <MultiSelectCorpsii
              mb="md"
              maxDropdownHeight={260}
              label="Dölj spelning"
              disabled={form.values.isPublic}
              description="Spelningsanmälan kommer inte att synas för dessa corps"
              placeholder="Välj corps..."
              {...form.getInputProps('hiddenFor')}
            />
            <SimpleGrid cols={2} mb="md" >
              <DatePicker
                label="Anmälningsstart"
                description="Lämna tom för att tillåta anmälan omedelbart"
                placeholder="Välj datum..."
                icon={<IconCalendar />}
                clearable={true}
                {...form.getInputProps('signupStart')}
              />
              <DatePicker
                label="Anmälningsstopp"
                description="Lämna tom för att tillåta anmälan tills spelningen börjar"
                placeholder="Välj datum..."
                icon={<IconCalendar />}
                clearable={true}
                {...form.getInputProps('signupEnd')}
              />
              <TextInput
                label="Kryssruta 1"
                placeholder="Kryssruta 1"
                description="Lämna tom för att inte visa kryssruta"
                {...form.getInputProps('checkbox1')}
              />
              <TextInput
                label="Kryssruta 2"
                placeholder="Kryssruta 2"
                description="Lämna tom för att inte visa kryssruta"
                {...form.getInputProps('checkbox2')}
              />
            </SimpleGrid>
            <Group position="apart">
              <Group position="left">
                <Checkbox
                  label="Allmän spelning?"
                  radius="xl"
                  {...form.getInputProps('isPublic')}
                />
                <Checkbox
                  label="Räknas positivt?"
                  radius="xl"
                  {...form.getInputProps('countPositively')}
                />
              </Group>
              <Group position="right">
                {!newGig &&
                  <Button
                    variant="outline"
                    compact
                    uppercase
                    onClick={() => {
                      if (window.confirm("Detta kommer att radera spelningen och går inte att ångra. Är du säker?")) {
                        // TODO: Delete gig
                        router.push('/');
                      }
                    }}>
                    Radera spelning
                  </Button>
                }
                <Button type="submit" loading={submittning}>
                  {newGig ? 'Skapa spelning' : 'Spara ändringar'}
                </Button>
              </Group>
            </Group>
          </form>
        }
      </Stack>
    </Group>
  );
}

export default AdminGig;
