'use client';

import { useForm } from '@mantine/form';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

interface FormValues {
  name: string;
  start: Date;
  end: Date;
}
const initialValues = {
  name: '',
  start: new Date(),
  end: new Date(),
};

const AdminKillerForm = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      name: (name) => (name.length > 0 ? null : 'Ange namn'),
      end: (end, values) =>
        end > values.start ? null : 'Slutdatum måste vara efter startdatum',
    },
    transformValues: (values) => ({
      ...values,
      start: new Date(values.start),
      end: new Date(values.end),
    }),
  });

  const mutation = api.killer.create.useMutation({
    onSuccess: () => {
      router.push('/killer');
    },
  });
  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <form
      className='flex flex-col gap-2'
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput label='Namn' withAsterisk {...form.getInputProps('name')} />
      <TextInput
        label='Starttid'
        type='datetime-local'
        withAsterisk
        {...form.getInputProps('start')}
      />
      <TextInput
        label='Sluttid'
        type='datetime-local'
        withAsterisk
        {...form.getInputProps('end')}
      />
      <Button type='submit'>Skapa</Button>
    </form>
  );
};

export default AdminKillerForm;
