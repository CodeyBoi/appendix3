import { TextInput, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '../../utils/trpc';

const defaultValues = {
  text: '',
};
type FormValues = typeof defaultValues;
type BingoEntryFormProps = {
  entry?: FormValues & { id: string };
};

const BingoEntryForm = ({ entry }: BingoEntryFormProps) => {
  const router = useRouter();
  // const utils = trpc.useContext();

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

  const mutation = trpc.bingo.upsertEntry.useMutation();

  const handleSubmit = async (values: FormValues) => {
    if (newEntry) {
      await mutation.mutateAsync(values);
      form.reset();
    } else {
      await mutation.mutateAsync({ ...values, id: entry.id });
      router.push('/bingo');
    }
  };

  //const removeMutation = trpc.quote.remove.useMutation({
  // onSuccess: () => {
  //  utils.quote.infiniteScroll.invalidate();
  //},
  //});

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        rightSection={
          <ActionIcon type='submit' variant='subtle' color='dark'>
            <IconSend />
          </ActionIcon>
        }
        label='Skapa ditt kort här'
        placeholder='koolt shtuff incoming'
        autosize='true'
        {...form.getInputProps('text')}
      />
    </form>
  );
};

export default BingoEntryForm;
