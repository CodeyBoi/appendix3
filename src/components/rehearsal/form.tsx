import {
  Stack,
  TextInput,
  Select,
  Group,
  Button,
  Checkbox,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendar } from '@tabler/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '../../utils/trpc';
import dayjs from 'dayjs';
import { Corps } from '@prisma/client';

const defaultValues = {
  title: '',
  date: null as unknown as Date,
  type: '',
};
type FormValues = typeof defaultValues;
type RehearsalFormProps = {
  rehearsal?: FormValues & { id: string };
};

const RehearsalForm = ({ rehearsal }: RehearsalFormProps) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: rehearsalTypes } = trpc.rehearsal.getTypes.useQuery();

  const newRehearsal = !rehearsal;

  const form = useForm<FormValues>({
    initialValues: newRehearsal
      ? defaultValues
      : {
          title: rehearsal.title,
          date: rehearsal.date,
          type: rehearsal.type,
        },
    validate: {
      title: (title) => (title ? null : 'Fyll i titel'),
      date: (date) => (date ? null : 'Välj datum'),
      type: (type) => (type ? null : 'Välj typ'),
    },
  });

  const mutation = trpc.rehearsal.upsert.useMutation({
    onSuccess: ({ id }) => {
      utils.rehearsal.getWithId.invalidate(rehearsal?.id ?? '');
      utils.rehearsal.getMany.invalidate();
      utils.rehearsal.getOrchestraStats.invalidate();
      utils.rehearsal.getBalletStats.invalidate();
      router.push('/admin/rehearsal/' + id);
    },
  });

  const handleSubmit = async (values: FormValues) => {
    values.date.setMinutes(
      values.date.getMinutes() - values.date.getTimezoneOffset(),
    );
    if (newRehearsal) {
      await mutation.mutateAsync(values);
    } else {
      await mutation.mutateAsync({ ...values, id: rehearsal.id });
    }
  };

  const attendenceMutation = trpc.rehearsal.updateAttendance.useMutation({
    onSuccess: ({ corpsId }) => {
      utils.rehearsal.getOrchestraStats.invalidate();
      utils.rehearsal.getBalletStats.invalidate();
      if (!newRehearsal) {
        utils.rehearsal.getAttendence.invalidate({
          id: rehearsal.id,
          corpsId,
        });
      }
    },
  });

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
              label: type,
              value: type,
            })) ?? []
          }
          {...form.getInputProps('type')}
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
