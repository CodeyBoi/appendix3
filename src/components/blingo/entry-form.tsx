'use client';

import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import ActionIcon from 'components/input/action-icon';
import TextInput from 'components/input/text-input';
import { api } from 'trpc/react';

const defaultValues = {
  text: '',
};
type FormValues = typeof defaultValues;
type BingoEntryFormProps = {
  entry?: FormValues & { id: string };
};

const BingoEntryForm = ({ entry }: BingoEntryFormProps) => {
  const router = useRouter();

  const newEntry = !entry;

  const form = useForm<FormValues>({
    initialValues: newEntry
      ? defaultValues
      : {
          text: entry.text,
        },
    validate: {
      text: (text) => (text ? null : 'Fyll i händelse'),
    },
  });

  const mutation = api.bingo.upsertEntry.useMutation();

  const handleSubmit = async (values: FormValues) => {
    if (newEntry) {
      await mutation.mutateAsync(values);
      form.reset();
    } else {
      await mutation.mutateAsync({ ...values, id: entry.id });
      router.push('/blingo');
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className='flex gap-2'>
        <TextInput
          label='Skapa ditt kort här'
          {...form.getInputProps('text')}
        />
        <ActionIcon type='submit' variant='subtle'>
          <IconSend />
        </ActionIcon>
      </div>
    </form>
  );
};

export default BingoEntryForm;
