import {
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Rehearsal } from '@prisma/client';
import { IconCalendar, IconSend } from '@tabler/icons';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

const defaultValues = {
  title: '',
  date: null as unknown as Date,
  typeId: '',
  countsPositively: false,
};
type FormValues = typeof defaultValues;
type RehearsalFormProps = {
  rehearsal?: Rehearsal;
  onSubmit?: () => void;
};

const RehearsalForm = ({ rehearsal, onSubmit }: RehearsalFormProps) => {
  const utils = trpc.useContext();
  const router = useRouter();

  const { data: rehearsalTypes } = trpc.rehearsal.getTypes.useQuery();

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
      date: (date) => (date ? null : 'Välj datum'),
      typeId: (typeId) => (typeId ? null : 'Välj typ'),
    },
  });

  const mutation = trpc.rehearsal.upsert.useMutation({
    onSuccess: ({ id }) => {
      utils.rehearsal.getWithId.invalidate(id);
      utils.rehearsal.getMany.invalidate();
      onSubmit?.();
      if (newRehearsal) {
        router.push(`/admin/rehearsal/${id}`);
      }
    },
  });

  const removeMutation = trpc.rehearsal.remove.useMutation({
    onSuccess: () => {
      utils.rehearsal.getMany.invalidate();
      router.replace('/admin/rehearsal');
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
        <Checkbox
          label='Räknas positivt?'
          {...form.getInputProps('countsPositively', {
            type: 'checkbox',
          })}
        />
        <Group position={newRehearsal ? 'right' : 'apart'}>
          {!newRehearsal && (
            <Button
              type='button'
              variant='outline'
              compact
              onClick={() => {
                if (!confirm('Är du säker på att du vill ta bort rep?')) return;
                removeMutation.mutate(rehearsal.id);
              }}
            >
              Ta bort
            </Button>
          )}
          <Button
            type='submit'
            leftIcon={<IconSend />}
            loading={mutation.isLoading}
            className='bg-red-600'
          >
            {newRehearsal ? 'Skapa' : 'Uppdatera'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default RehearsalForm;
