import { Stack, TextInput, Select, Group, Button } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendar } from '@tabler/icons';
import React from 'react';
import { trpc } from '../../utils/trpc';
import { Rehearsal } from '@prisma/client';

const defaultValues = {
  title: '',
  date: null as unknown as Date,
  typeId: '',
};
type FormValues = typeof defaultValues;
type RehearsalFormProps = {
  rehearsal?: Rehearsal;
  onSubmit?: () => void;
};

const RehearsalForm = ({ rehearsal, onSubmit }: RehearsalFormProps) => {
  const utils = trpc.useContext();

  const { data: rehearsalTypes } = trpc.rehearsal.getTypes.useQuery();

  const newRehearsal = !rehearsal;

  const form = useForm<FormValues>({
    initialValues: newRehearsal
      ? defaultValues
      : {
          title: rehearsal.title,
          date: rehearsal.date,
          typeId: rehearsal.typeId.toString(),
        },
    validate: {
      title: (title) => (title ? null : 'Fyll i titel'),
      date: (date) => (date ? null : 'Välj datum'),
      typeId: (typeId) => (typeId ? null : 'Välj typ'),
    },
  });

  const mutation = trpc.rehearsal.upsert.useMutation({
    onSuccess: ({ id }) => {
      utils.rehearsal.getWithId.invalidate(rehearsal?.id ?? '');
      utils.rehearsal.getMany.invalidate();
      utils.rehearsal.getOrchestraStats.invalidate();
      utils.rehearsal.getBalletStats.invalidate();
      onSubmit?.();
    },
  });

  const handleSubmit = async (values: FormValues) => {
    values.date.setMinutes(
      values.date.getMinutes() - values.date.getTimezoneOffset(),
    );
    if (newRehearsal) {
      await mutation.mutateAsync({
        ...values,
        typeId: parseInt(values.typeId),
      });
    } else {
      await mutation.mutateAsync({
        ...values,
        typeId: parseInt(values.typeId),
        id: rehearsal.id,
      });
    }
  };

  return (
    <form style={{ width: '100%' }} onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label='Titel'
          placeholder='Titel'
          withAsterisk
          spellCheck={false}
          {...form.getInputProps('title')}
        />
        <DatePicker
          label='Datum'
          withAsterisk
          placeholder='Välj datum'
          icon={<IconCalendar />}
          clearable={false}
          {...form.getInputProps('date')}
        />
        <Select
          withAsterisk
          label='Typ av repa'
          placeholder='Välj typ...'
          data={
            rehearsalTypes?.map((type) => ({
              label: type.name,
              value: type.id.toString(),
            })) ?? []
          }
          {...form.getInputProps('typeId')}
        />
        <Group position='right'>
          <Button type='submit'>
            {(newRehearsal ? 'Skapa' : 'Uppdatera') + ' repa'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default RehearsalForm;
