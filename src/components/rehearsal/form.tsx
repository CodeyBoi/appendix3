'use client';

import { useForm } from '@mantine/form';
import { Rehearsal } from '@prisma/client';
import { IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Select from 'components/input/select';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import Checkbox from 'components/input/checkbox';
import { api } from 'trpc/react';
import DatePicker from 'components/input/date-picker';

const defaultValues = {
  title: '',
  date: null as unknown as Date,
  typeId: '',
  countsPositively: false,
};
type FormValues = typeof defaultValues;
interface RehearsalFormProps {
  rehearsal?: Rehearsal;
  onSubmit?: () => void;
}

const RehearsalForm = ({ rehearsal, onSubmit }: RehearsalFormProps) => {
  const utils = api.useUtils();
  const router = useRouter();

  const { data: rehearsalTypes } = api.rehearsal.getTypes.useQuery();

  const newRehearsal = !rehearsal;

  const form = useForm<FormValues>({
    initialValues: newRehearsal
      ? defaultValues
      : {
          title: rehearsal.title,
          date: rehearsal.date,
          typeId: rehearsal.typeId.toString(),
          countsPositively: rehearsal.countsPositively,
        },
    validate: {
      title: (title) => (title ? null : 'Fyll i titel'),
      typeId: (typeId) => (typeId ? null : 'Välj typ'),
    },
  });

  const mutation = api.rehearsal.upsert.useMutation({
    onSuccess: async ({ id }) => {
      await utils.rehearsal.getWithId.invalidate(id);
      await utils.rehearsal.getMany.invalidate();
      onSubmit?.();
      if (newRehearsal) {
        router.push(`/admin/rehearsal/${id}`);
      }
    },
  });

  const removeMutation = api.rehearsal.remove.useMutation({
    onSuccess: async () => {
      await utils.rehearsal.getMany.invalidate();
      router.replace('/admin/rehearsal');
    },
  });

  const handleSubmit = (values: FormValues) => {
    values.date.setMinutes(
      values.date.getMinutes() - values.date.getTimezoneOffset(),
    );
    if (newRehearsal) {
      mutation.mutate({
        ...values,
        typeId: parseInt(values.typeId),
      });
    } else {
      mutation.mutate({
        ...values,
        typeId: parseInt(values.typeId),
        id: rehearsal.id,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className='flex flex-col gap-2'>
        <TextInput
          label='Titel'
          withAsterisk
          spellCheck={false}
          {...form.getInputProps('title')}
        />
        <DatePicker
          label='Datum'
          withAsterisk
          {...form.getInputProps('date')}
        />
        <Select
          withAsterisk
          label='Typ av repa'
          placeholder='Välj typ...'
          options={
            rehearsalTypes?.map((type) => ({
              label: type.name,
              value: type.id.toString(),
            })) ?? []
          }
          {...form.getInputProps('typeId')}
        />
        <Checkbox
          label='Räknas positivt?'
          {...form.getInputProps('countsPositively', {
            type: 'checkbox',
          })}
        />
        <div className='flex items-center justify-end gap-4'>
          {!newRehearsal && (
            <Button
              className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
              color='transparent'
              compact
              onClick={() => {
                if (!confirm('Är du säker på att du vill ta bort rep?')) return;
                removeMutation.mutate(rehearsal.id);
              }}
            >
              Ta bort
            </Button>
          )}
          <Button color='red' type='submit' disabled={mutation.isLoading}>
            <IconSend />
            {newRehearsal ? 'Skapa' : 'Uppdatera'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RehearsalForm;
