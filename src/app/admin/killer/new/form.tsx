'use client';

import { useForm } from '@mantine/form';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import MultiSelect from 'components/multi-select';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

type FormValues = {
  name: string;
  start: Date;
  end: Date;
  participants: string[];
};
const initialValues = {
  name: '',
  start: new Date(),
  end: new Date(),
  participants: [] as string[],
};

const AdminKillerForm = () => {
  const router = useRouter();

  const { data: corpsii } = api.corps.getMany.useQuery({});
  const corpsiiOptions = corpsii?.map((c) => ({
    label:
      (c.number ? '#' + c.number : 'p.e.') +
      ' ' +
      c.firstName +
      ' ' +
      (c.nickName ? '"' + c.nickName + '" ' : '') +
      c.lastName,
    value: c.id,
  }));

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      name: (name) => (name.length > 0 ? null : 'Ange namn'),
      end: (end, values) =>
        end && end > values.start
          ? null
          : 'Slutdatum måste vara efter startdatum',
    },
    transformValues: (values) => ({
      ...values,
      start: new Date(values.start),
      end: new Date(values.end),
    }),
  });

  const mutation = api.killer.create.useMutation({
    onSuccess: () => {
      form.reset();
      router.push('/killer');
    },
  });
  const handleSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
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
      <MultiSelect
        label='Deltagare'
        className='outline-none focus-visible:outline-none'
        options={corpsiiOptions ?? []}
        {...form.getInputProps('participants')}
      />
      <Button type='submit'>Skapa</Button>
    </form>
  );
};

export default AdminKillerForm;
