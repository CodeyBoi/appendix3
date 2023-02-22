import { Stack, TextInput, Group, Button, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '../../utils/trpc';
import SelectCorps from '../select-corps';

const defaultValues = {
  quote: '',
  location: '',
  saidByCorpsId: '',
};
type FormValues = typeof defaultValues;
type QuoteFormProps = {
  quote?: FormValues & { id: string };
};

const QuoteForm = ({ quote }: QuoteFormProps) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const newQuote = !quote;

  const form = useForm<FormValues>({
    initialValues: newQuote
      ? defaultValues
      : {
          quote: quote.quote,
          location: quote.location,
          saidByCorpsId: quote.saidByCorpsId,
        },
    validate: {
      quote: (quote) => (quote ? null : 'Fyll i citat'),
      saidByCorpsId: (saidByCorpsId) => (saidByCorpsId ? null : 'Välj corps'),
    },
  });

  const mutation = trpc.quote.upsert.useMutation({
    onSuccess: () => {
      utils.quote.infiniteScroll.invalidate();
      router.push(`/quotes`);
    },
  });
  const handleSubmit = async (values: FormValues) => {
    if (newQuote) {
      await mutation.mutateAsync(values);
    } else {
      await mutation.mutateAsync({ ...values, id: quote.id });
    }
  };

  const removeMutation = trpc.song.remove.useMutation({
    onSuccess: () => {
      utils.song.getAll.invalidate();
      router.push('/quotes');
    },
  });

  return (
    <form style={{ width: '100%' }} onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Textarea
          label='Vad sades?'
          placeholder='Citat'
          withAsterisk
          autosize
          {...form.getInputProps('quote')}
        />
        <SelectCorps
          label='Vem sade detta?'
          placeholder='Välj corps...'
          withAsterisk
          defaultValue={quote?.saidByCorpsId}
          {...form.getInputProps('saidByCorpsId')}
        />
        <TextInput
          label='Var sades detta?'
          placeholder='Plats'
          {...form.getInputProps('location')}
        />
        <Group position='right'>
          {quote && (
            <Button
              variant='outline'
              compact
              onClick={async () => {
                if (
                  window.confirm('Är du säker på att du vill ta bort citatet?')
                ) {
                  await removeMutation.mutateAsync({ id: quote.id });
                }
              }}
            >
              RADERA CITAT
            </Button>
          )}
          <Button type='submit'>
            {(newQuote ? 'Skapa' : 'Uppdatera') + ' citat'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default QuoteForm;
