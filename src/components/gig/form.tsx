'use client';

import { Checkbox, NumberInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Gig } from '@prisma/client';
import { IconCalendar, IconClock } from '@tabler/icons';
import React from 'react';
import { trpc } from 'utils/trpc';
import FormLoadingOverlay from '../form-loading-overlay';
import MultiSelectCorps from '../multi-select-corps';
import { useRouter } from 'next/navigation';
import Select from 'components/input/select';
import TextInput from 'components/input/text-input';
import Button from 'components/input/button';
import TextArea from 'components/input/text-area';

interface GigFormProps {
  gig?: Gig & { type: { name: string } } & { hiddenFor: { corpsId: string }[] };
  gigTypes: string[];
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

const GigForm = ({ gig, gigTypes }: GigFormProps) => {
  const utils = trpc.useUtils();
  const newGig = !gig;
  const gigId = gig?.id ?? 'new';
  const [submitting, setSubmitting] = React.useState(false);

  const router = useRouter();

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
      router.push(`/gig/${gigId}`);
    },
  });

  const removeGig = trpc.gig.remove.useMutation({
    onSuccess: () => {
      utils.gig.getWithId.invalidate({ gigId });
      utils.gig.getMany.invalidate();
      setSubmitting(false);
      router.push('/');
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
      <form className='max-w-3xl' onSubmit={form.onSubmit(handleSubmit)}>
        <div className='grid grid-cols-1 content-baseline gap-x-4 gap-y-2 md:grid-cols-2'>
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
            options={
              gigTypes?.map((type) => ({
                value: type,
                label: type,
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
          <TextInput
            label='Plats'
            placeholder='Plats'
            spellCheck={false}
            {...form.getInputProps('location')}
          />
          <div className='grid grid-cols-2 gap-x-4'>
            <TextInput
              icon={<IconClock />}
              label='Samlingstid'
              placeholder='Samlingstid'
              spellCheck='false'
              {...form.getInputProps('meetup')}
            />
            <TextInput
              icon={<IconClock />}
              label='Spelningstart'
              placeholder='Spelningstart'
              spellCheck='false'
              {...form.getInputProps('start')}
            />
          </div>
          <div className='col-span-1 md:col-span-2'>
            <TextArea
              autoSize
              label='Beskrivning'
              placeholder='Beskrivning'
              {...form.getInputProps('description')}
            />
          </div>
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
          <div className='col-span-1 md:col-span-2'>
            <MultiSelectCorps
              maxDropdownHeight={260}
              label='Dölj spelning'
              disabled={form.values.isPublic}
              defaultValue={form.values.hiddenFor}
              description='Spelningsanmälan kommer inte att synas för dessa corps'
              placeholder='Välj corps...'
              {...form.getInputProps('hiddenFor')}
            />
          </div>
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
                className='text-red-600 border-red-600 hover:bg-red-600 hover:text-white'
                color='transparent'
                compact
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
                RADERA SPELNING
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
      </form>
    </FormLoadingOverlay>
  );
};

export default GigForm;
