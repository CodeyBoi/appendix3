import {
  Button,
  Checkbox,
  Grid,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Gig } from '@prisma/client';
import { IconCalendar, IconClock } from '@tabler/icons';
import React from 'react';
import { trpc } from '../../utils/trpc';
import FormLoadingOverlay from '../form-loading-overlay';
import MultiSelectCorps from '../multi-select-corps';

interface GigFormProps {
  gig?: Gig & { type: { name: string } } & { hiddenFor: { corpsId: string }[] };
  onSubmit?: () => void;
}

const initialValues = {
  title: '',
  type: '',
  description: '',
  location: '',
  date: null as unknown as Date,
  meetup: '',
  start: '',
  signupStart: null as unknown as Date | null,
  signupEnd: null as unknown as Date | null,
  isPublic: false,
  points: 1,
  countsPositively: false,
  checkbox1: '',
  checkbox2: '',
  hiddenFor: [] as string[],
};
type FormValues = typeof initialValues;

const GigForm = ({ gig, onSubmit }: GigFormProps) => {
  const utils = trpc.useContext();
  const newGig = !gig;
  const gigId = gig?.id ?? 'new';
  const { data: gigTypes } = trpc.gigType.getAll.useQuery();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    initialValues: newGig
      ? initialValues
      : {
          ...gig,
          type: gig.type.name,
          hiddenFor: gig.hiddenFor.map((c) => c.corpsId),
        },
    validate: {
      title: (title) => (title ? null : 'Titel måste vara ifylld'),
      type: (type) => (type ? null : 'Typ måste vara ifylld'),
      date: (date) => (date ? null : 'Datum måste vara ifyllt'),
      points: (points) =>
        points >= 0 ? null : 'Spelpoäng kan inte vara negativt',
    },
  });

  const mutation = trpc.gig.upsert.useMutation({
    onSuccess: () => {
      utils.gig.getWithId.invalidate({ gigId });
      utils.gig.getMany.invalidate();
      setSubmitting(false);
      onSubmit?.();
    },
  });

  const removeGig = trpc.gig.remove.useMutation({
    onSuccess: () => {
      utils.gig.getWithId.invalidate({ gigId });
      utils.gig.getMany.invalidate();
      setSubmitting(false);
      onSubmit?.();
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    values.date.setMinutes(
      values.date.getMinutes() - values.date.getTimezoneOffset(),
    );
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
    <FormLoadingOverlay visible={submitting}>
      <form
        style={{ maxWidth: '720px' }}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <div className='grid grid-cols-1 space-x-4 md:grid-cols-2'>
          <TextInput
            label='Titel'
            placeholder='Titel'
            withAsterisk
            spellCheck={false}
            {...form.getInputProps('title')}
          />
          <Select
            withAsterisk
            label='Spelningstyp'
            placeholder='Välj typ...'
            data={
              gigTypes?.map((type) => ({
                value: type.name,
                label: type.name,
              })) ?? []
            }
            {...form.getInputProps('type')}
          />
          <NumberInput
            withAsterisk
            label='Spelpoäng'
            {...form.getInputProps('points')}
          />
          <DatePicker
            withAsterisk
            label='Spelningsdatum'
            placeholder='Välj datum...'
            icon={<IconCalendar />}
            clearable={false}
            {...form.getInputProps('date')}
          />
          <Grid>
            <Grid.Col span={12} md={6}>
              <TextInput
                label='Plats'
                placeholder='Plats'
                spellCheck={false}
                {...form.getInputProps('location')}
              />
            </Grid.Col>
            <Grid.Col span={6} md={3}>
              <TextInput
                icon={<IconClock />}
                label='Samlingstid'
                placeholder='Samlingstid'
                spellCheck='false'
                {...form.getInputProps('meetup')}
              />
            </Grid.Col>
            <Grid.Col span={6} md={3}>
              <TextInput
                icon={<IconClock />}
                label='Spelningstart'
                placeholder='Spelningstart'
                spellCheck='false'
                {...form.getInputProps('start')}
              />
            </Grid.Col>
          </Grid>
          <Textarea
            autosize
            label='Beskrivning'
            placeholder='Beskrivning'
            {...form.getInputProps('description')}
          />
          <SimpleGrid cols={1} breakpoints={[{ minWidth: 'md', cols: 2 }]}>
            <DatePicker
              label='Anmälningsstart'
              description='Lämna tom för att tillåta anmälan omedelbart'
              placeholder='Välj datum...'
              icon={<IconCalendar />}
              clearable={true}
              {...form.getInputProps('signupStart')}
            />
            <DatePicker
              label='Anmälningsstopp'
              description='Lämna tom för att tillåta anmälan tills spelningen börjar'
              placeholder='Välj datum...'
              icon={<IconCalendar />}
              clearable={true}
              {...form.getInputProps('signupEnd')}
            />
            <TextInput
              label='Kryssruta 1'
              placeholder='Kryssruta 1'
              description='Lämna tom för att inte visa kryssruta'
              {...form.getInputProps('checkbox1')}
            />
            <TextInput
              label='Kryssruta 2'
              placeholder='Kryssruta 2'
              description='Lämna tom för att inte visa kryssruta'
              {...form.getInputProps('checkbox2')}
            />
          </SimpleGrid>
          <MultiSelectCorps
            maxDropdownHeight={260}
            label='Dölj spelning'
            disabled={form.values.isPublic}
            defaultValue={form.values.hiddenFor}
            description='Spelningsanmälan kommer inte att synas för dessa corps'
            placeholder='Välj corps...'
            {...form.getInputProps('hiddenFor')}
          />
          <div className='grid items-baseline grid-cols-1 space-y-4 md:grid-cols-2'>
            <div className='flex space-x-4 whitespace-nowrap'>
              <Checkbox
                label='Allmän spelning?'
                radius='xl'
                {...form.getInputProps('isPublic', { type: 'checkbox' })}
              />
              <Checkbox
                label='Räknas positivt?'
                radius='xl'
                {...form.getInputProps('countsPositively', {
                  type: 'checkbox',
                })}
              />
            </div>
            <div className='flex items-center justify-end space-x-4'>
              {!newGig && (
                <Button
                  variant='outline'
                  compact
                  uppercase
                  onClick={() => {
                    if (
                      window.confirm(
                        'Detta kommer att radera spelningen och går inte att ångra. Är du säker?',
                      )
                    ) {
                      removeGig.mutateAsync({ gigId });
                    }
                  }}
                >
                  Radera spelning
                </Button>
              )}
              <Button
                type='submit'
                className='bg-red-600'
                disabled={!form.isDirty()}
              >
                {newGig ? 'Skapa spelning' : 'Spara ändringar'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormLoadingOverlay>
  );
};

export default GigForm;
